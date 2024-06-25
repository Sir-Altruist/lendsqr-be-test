import chai from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import { expect } from 'chai'
import { env } from '../src/config'

const identity = "altruist@gmail.com"
describe('Test karma lookup endpoint', () => {
    it('should return success response if user is not in blacklist', async () => {
        const response = await chai
            .request(`${env.LENDSQR_API_BASE_URL}`)
            .get(`/verification/karma/${identity}`)
            .auth(`${env.LENDSQR_SECRET_KEY}`, { type: 'bearer' })
            console.log(response.body.message)
        expect(response.body.message).to.equal('Identity not found in karma')
        expect(response.body).to.haveOwnProperty("meta").to.be.an("object")
    })
})