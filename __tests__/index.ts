const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
import server from '../src/server'
import { expect } from 'chai'
// import { env } from '../src/config'


const userAData = {
    "fullName": "John Doe",
    "email": "johndoe@gmail.com",
    "phoneNumber": "08180000000",
    "username": "John",
    "bvn": "12345678901",
    "password": "johndoe@1",
    "confirm": "johndoe@1"
}

const userBData = {
    "fullName": "Jane Doe",
    "email": "janedoe@gmail.com",
    "phoneNumber": "08180000001",
    "username": "Jane",
    "bvn": "12345678902",
    "password": "janedoe@1",
    "confirm": "janedoe@1"
}

describe('Authentication route on signup', () => {
    it('should successfully signup a new user', async () => {
        const response = await chai.request(server)
            .post('/v1.0/api/auth/signup')
            .set('Content-Type', 'application/json')
            .send(userAData);
        expect(response.body.status).to.equal('success')
        expect(response.body.data).to.be.a('object')
        expect(response.body.data.password).to.be.a('string')

    })
})