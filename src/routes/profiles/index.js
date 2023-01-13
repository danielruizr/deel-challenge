const express = require('express')
const router = express.Router()

const { getProfiles } = require('./getProfiles')


router.get('/', getProfiles)



module.exports = router
