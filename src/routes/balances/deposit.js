const { Op } = require('sequelize')
const { errorMessages } = require('../../constants')



/*
 * POST to deposit funds into the client's balance
 * with a maximum deposit amount of 25% of total of jobs to pay
 */
const deposit = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const { amount } = req.body
  const { userId } = req.params
  const client = await Profile.findOne({ where: { id: userId || 0 } })

  if (!userId || !client?.id || !amount) {
    console.warn(errorMessages.noValidClientOrAmount)
    return res.status(400).json(
      { 
        success: false, 
        error: errorMessages.noValidClientOrAmount
      })
  }
  

  const jobs = await Job.findAll({
    where: {
      [Op.or]: [{ paid: null }, { paid: false }],
    },
    include: {
      model: Contract,
      where: {
        status: {
          [Op.ne]: 'terminated'
        },
        ClientId: userId,
      }
    }
  })

  const jobsToPay = jobs.reduce((totalPrice, currentJob) => totalPrice + currentJob.price, 0)
  const maximumAmountToDeposit = jobsToPay * 0.25
  const amountToDeposit = amount > maximumAmountToDeposit ? maximumAmountToDeposit : amount

  const dbTransaction = await sequelize.transaction() 
  try {
    client.balance += amountToDeposit
    await client.save()
    await dbTransaction.commit()
  } catch (err) {
    // rollback entire operation if something fails
    await dbTransaction.rollback()
    console.warn(errorMessages.errorMakingDeposit + `clientID: ${client.id}`)
    return res.status(400).json({
      success: false,
      error: errorMessages.errorMakingDeposit,
    })
  }
  
  return res.status(200).json({
    success: true,
    amountDeposited: amountToDeposit,
    clientId: userId,
  })
}

module.exports = { deposit }
