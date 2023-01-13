const app = require('../src/app')
const request = require('supertest')(app)



describe('test contract endpoints', () => {
    test(`with a user profile selected, it should return an array of contracts`, async () => {
      expect.assertions(2)
      const res = await request.get(`/contracts`).set('profile_id', 6)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
    test(`without a user profile selected it should return a status 401`, async () => {
      expect.assertions(1)
      const res = await request.get(`/contracts`)
      expect(res.status).toBe(401)
    })
    test(`return the contract belonging to the selected user profile`, async () => {
      expect.assertions(2)
      const res = await request.get(`/contracts/2`).set('profile_id', 6)
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(2)
    })
    test(`return an error when trying to query a contract not belongin to the selected user profile`, async () => {
      expect.assertions(2)
      const res = await request.get(`/contracts/2`).set('profile_id', 2)
      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })