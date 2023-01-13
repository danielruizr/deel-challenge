const express = require('express')
const router = express.Router()

const { getProfile } = require('../../middleware/getProfile')

const { getUnpaidJobs } = require('./getUnpaidJobs')
const { payJob } = require('./payJob')



router.get('/unpaid', getProfile, getUnpaidJobs)
router.post('/:job_id/pay', getProfile, payJob)




module.exports = router
