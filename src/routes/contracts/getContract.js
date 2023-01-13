const { Op } = require('sequelize')
const { errorMessages } = require('../../constants')


/*
 * GET to return the contract by id
 * for the provided profile id
 */
const getContract = async (req, res) => {
  const { Contract } = req.app.get('models')
  const { id } = req.params
  const profile = req.profile
  const currentUser = profile.dataValues
  if (!id) {
    console.warn(errorMessages.noValidContractId)
    return res.status(400).json(
      { 
        success: false, 
        error: errorMessages.noValidContractId
      })
  }
  const contract = await Contract.findOne(
    { 
      where: 
      { 
        id, 
        [Op.or]: [{ ContractorId: currentUser.id }, { ClientId: currentUser.id }], 
      } 
    })
  if(!contract) {
    console.warn(errorMessages.profileNoContract)
    return res.status(400).json({
      success: false,
      error: errorMessages.profileNoContract
    })
  }
  return res.status(200).json(contract)
}
  
module.exports = { getContract }