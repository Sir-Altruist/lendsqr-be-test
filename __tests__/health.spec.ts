import chai from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import { expect } from 'chai'
import server from '../src/server'


describe('Healthcheck', () => {
    it('should return 200 if server is on', async () => {
        const response = await chai.request(server)
            .get('/v1.0/api/healthcheck')
        expect(response).to.have.status(200)
    })
})