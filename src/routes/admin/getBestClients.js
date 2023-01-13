const { Op } = require('sequelize')
const { errorMessages } = require('../../constants')



/*
 * GET to return the highest paying clients
 * given the price in the jobs
 */
const getBestClients = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const { start, end, limit = 2 } = req.query
  if (!Date.parse(start) || !Date.parse(end)) {
    console.warn(errorMessages.notValidDateInQueryParams)
    return res.status(400).json({ success: false, error: errorMessages.notValidDateInQueryParams })
  }
  const startDate = new Date(start)
  const endDate = new Date(end)


  const jobs = await Job.findAll({
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total_amount'],
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      }

    },
    group: 'Contract.ClientId',
    order: [['total_amount', 'DESC'],],
    limit,
    include: [
      { 
        model: Contract, 
        attributes:['ClientId'], 
        include: [{ model: Profile, as: 'Client' }] 
      }
    ],
  })

  return res.status(200).json(jobs || [])
}

module.exports = { getBestClients }
