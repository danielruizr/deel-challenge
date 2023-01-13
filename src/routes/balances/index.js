const express = require('express')
const router = express.Router()

const { deposit } = require('./deposit')


router.post('/deposit/:userId', deposit)


module.exports = router
