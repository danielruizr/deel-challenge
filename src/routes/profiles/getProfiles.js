
/*
 * GET to return all the profiles
 */
const getProfiles = async (req, res) => {
  const { Profile } = req.app.get('models')

  const profiles = await Profile.findAll()
  res.status(200).json(profiles || [])
  return
}

module.exports = { getProfiles }
