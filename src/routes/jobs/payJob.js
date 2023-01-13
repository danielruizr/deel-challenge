const { Op } = require('sequelize')
const { errorMessages } = require('../../constants')


/*
 * POST to pay a job by id
 * only if client has balance >= to job price
 */
const payJob = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const profile = req.profile
  const { job_id: jobId } = req.params
  const currentUser = profile.dataValues
  const clientBalance = currentUser.balance
  if (!jobId) {
    console.warn(errorMessages.noValidJobId)
    res.status(400).json(
      { 
        success: false, 
        error: errorMessages.noValidJobId
      })
    return
  }
  
  const job = await Job.findOne({
    where: {
      id: jobId,
      [Op.or]: [{ paid: null }, { paid: false }],
    },
    include: {
      model: Contract,
      where: {
        status: {
          [Op.ne]: 'terminated'
        },
        ClientId: currentUser.id,
      }
    }
  })

  if (job.price > clientBalance) {
    console.warn(errorMessages.notEnoughFunds + ` jobId: ${job.id}, clientId: ${currentUser.id}`)
    return res.status(400).json({
      success: false,
      error: errorMessages.notEnoughFunds,
    })
  }

  const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId } })
  const dbTransaction = await sequelize.transaction() 
  try {
    profile.balance -= job.price
    contractor.balance += job.price
    job.paid = true
    job.paymentDate = new Date()
    await Promise.all([profile.save(), contractor.save(), job.save()])
    await dbTransaction.commit()
  } catch (err) {
    // rollback entire operation if something fails
    console.warn(errorMessages.errorPayingJob + ` jobId: ${job.id}, clientId: ${currentUser.id}`)
    await dbTransaction.rollback()
    return res.status(400).json({
      success: false,
      error: errorMessages.errorPayingJob
    })
  }
  
  return res.status(200).json({
    success: true,
    jobPaid: job.id,
  })
}

module.exports = { payJob }
