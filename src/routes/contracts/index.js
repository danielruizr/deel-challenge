const express = require('express')
const router = express.Router()

const { getProfile } = require('../../middleware/getProfile')

const { getContracts } = require('./getContracts')
const { getContract } = require('./getContract')


router.get('/', getProfile, getContracts)
router.get('/:id', getProfile, getContract)



module.exports = router
