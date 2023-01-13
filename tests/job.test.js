const app = require('../src/app')
const request = require('supertest')(app)
const { Profile, Job, Contract } = require('../src/model')

let testJobUnpaid;
let testJobPaid;
let testClient;
let testContractor;
let testContract;
// Creating fake data for test cases
beforeAll(async () => {
    testClient = await Profile.create({
        firstName: 'JEST TEST CLIENT',
        lastName: 'JEST TEST CLIENT',
        profession: 'Wizard',
        balance: 1000,
        type:'client'
    })

    testContractor = await Profile.create({
        firstName: 'JEST TEST CONTRACTOR',
        lastName: 'JEST TEST CONTRACTOR',
        profession: 'Wizard',
        balance: 203,
        type:'contractor'
    })

    testContract = await Contract.create({
        terms: 'JEST TEST CONTRACT',
        status: 'in_progress',
        ClientId: testClient.id,
        ContractorId: testContractor.id
    })
    
    testJobUnpaid = await Job.create({
        description: 'work',
        price: 200,
        ContractId: testContract.id,
    })

    testJobPaid = await Job.create({
        description: 'work',
        price: 203,
        paid:true,
        paymentDate:'2020-08-15T19:11:26.737Z',
        ContractId: testContract.id,
    })
})
// Making sure test data won't persist in db
afterAll(async () => {
    await testJobUnpaid.destroy()
    await testJobPaid.destroy()
    await testContract.destroy()
    await testClient.destroy()
    await testContractor.destroy()
})

describe('test job endpoints', () => {
    test(`with a user profile selected, it should return an array of jobs, 
    that doesn't contain paid jobs`, async () => {
      expect.assertions(3)
      const res = await request.get(`/jobs/unpaid`).set('profile_id', testContractor.id)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.every((job) => !job.paid)).toBe(true)
    })

    test(`validate the job payment is succesful, balances and job are updated correctly`, async () => {
      expect.assertions(4)
      const res = await request.post(`/jobs/${testJobUnpaid.id}/pay`).set('profile_id', testClient.id)
      await testClient.reload()
      await testContractor.reload()
      await testJobUnpaid.reload()
      expect(res.status).toBe(200)
      expect(testClient.balance).toBe(800)
      expect(testContractor.balance).toBe(403)
      expect(testJobUnpaid.paid).toBe(true)
    })
  })