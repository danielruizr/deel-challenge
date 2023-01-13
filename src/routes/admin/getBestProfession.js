const { Op } = require('sequelize')
const { errorMessages } = require('../../constants')


/*
 * GET to return the best profession
 * given the price in the jobss
 */
const getBestProfession = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const { start, end } = req.query

  if (!Date.parse(start) || !Date.parse(end)) {
    console.warn(errorMessages.notValidDateInQueryParams)
    return res.status(400).json({ success: false, error: errorMessages.notValidDateInQueryParams })
  }
  const startDate = new Date(start)
  const endDate = new Date(end)

  const [job] = await Job.findAll({
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total_amount'],
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      }

    },
    group: 'Contract.Contractor.profession',
    order: [['total_amount', 'DESC'],],
    limit: 1,
    include: [
      { 
        model: Contract, 
        attributes:['ContractorId'], 
        include: [{ model: Profile, as: 'Contractor', attributes: ['profession'] }] 
      }
    ],
  })

  if (!job) {
    console.warn(errorMessages.adminNoBestProfession)
    return res.status(400).json({
      success: false,
      error: errorMessages.adminNoBestProfession,
    })
    
  }

  return res.status(200).json({
    success: true,
    profession: job.Contract?.Contractor?.profession,
    amountPaid: job.total_amount,
  })
  
}

module.exports = { getBestProfession }
