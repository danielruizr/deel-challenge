const express = require('express')
const router = express.Router()


const { getBestProfession } = require('./getBestProfession')
const { getBestClients } = require('./getBestClients')




router.get('/best-profession', getBestProfession)
router.get('/best-clients', getBestClients)





module.exports = router
