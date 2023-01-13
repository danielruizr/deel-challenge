const { Op } = require('sequelize')


/*
 * GET to return all the contracts not terminated
 * for the given user
 */
const getContracts = async (req, res) => {
  const { Contract } = req.app.get('models')
  const profile = req.profile
  const currentUser = profile.dataValues

  let contracts = await Contract.findAll({
    where: {
      status: {
        [Op.ne]: 'terminated'
      },
      [Op.or]: [{ ContractorId: currentUser.id }, { ClientId: currentUser.id }],
    }
  })
  res.status(200).json(contracts || [])
  return
}

module.exports = { getContracts }
