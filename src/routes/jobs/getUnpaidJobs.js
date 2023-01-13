const { Op } = require('sequelize')


/*
 * GET to return all the unpaid jobs
 * for the given user
 */
const getUnpaidJobs = async (req, res) => {
  const { Contract, Job } = req.app.get('models')
  const profile = req.profile
  const currentUser = profile.dataValues

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
        [Op.or]: [{ ContractorId: currentUser.id }, { ClientId: currentUser.id }],
      }
    }
  })
  res.status(200).json(jobs || [])
  return
}

module.exports = { getUnpaidJobs }
