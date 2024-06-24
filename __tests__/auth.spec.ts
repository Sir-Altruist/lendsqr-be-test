import chai from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import { expect } from 'chai'
import server from '../src/server'
import { db } from '../src/datasources'
import { v4 } from 'uuid'
import { IUser } from '../src/interfaces'
import { UserRepo } from '../src/repositories'
import { Logger } from '../src/libs'



const userAData: IUser = {
    "fullName": "Esho Oluwasegun",
    "email": "altruist1@gmail.com",
    "phoneNumber": "08180000001",
    "username": "Altruist",
    "bvn": "12345678908",
    "password": "altruist@1",
    "confirm": "altruist@1"
}

const loginData = {
    "emailPhone": "altruist1@gmail.com",
    "password": "altruist@1"
}

const userBData = {
    "fullName": "Jane Doe",
    "email": "janedoe@gmail.com",
    "phoneNumber": "08180000001",
    "username": "Jane",
    "bvn": "12345678902",
    "password": "janedoe@1",
}

describe.skip('Authentication on signup', () => {
    it('should successfully signup a new user', async () => {
        const response = await chai
            .request(server)
            .post('/v1.0/api/auth/signup')
            .set('Content-Type', 'application/json')
            .send(userAData);
        expect(response).to.have.status(201)
        expect(response.body.status).to.equal('success')
        expect(response.body.data).to.be.a('object')
        expect(response.body.data.details.username).to.be.a('string')
    })

    it('should return a validation error when supplied with an empty email', async () => {
        const response = await chai
          .request(server)
          .post('/v1.0/api/auth/signup')
          .send({ ...userAData, email: '' });
        expect(response).to.have.status(400);
        expect(response.body.status).to.equal('failed');
        expect(response.body).to.be.a('object');
        expect(response.body.message).to.equal('Please enter a valid email address');
    })

    it('should return an integrity error when an existing user\'s email is supplied', async () => {
        const response = await chai
          .request(server)
          .post('/v1.0/api/auth/signup')
          .send(userAData);
        expect(response).to.have.status(409);
        expect(response.body.status).to.equal('failed');
        expect(response.body).to.be.a('object');
        expect(response.body.message).to.equal(`Email or phone number already exist`);
    });
})

describe('Authentication on signin', () => {
    const { emailPhone, password } = loginData
    it('should succesfully login an existing user with emailOrPhoneNumber and password', async () => {
      const response = await chai
        .request(server)
        .post('/v1.0/api/auth/signin')
        .send(loginData);
      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('success');
      expect(response.body).to.be.a('object');
      expect(response.body.data.message).to.be.a('string');
      expect(response.body.data.message).to.equal('Login successful');
    });
    it('should fail when an incorrect password is inputed', async () => {
      const response = await chai
        .request(server)
        .post('/v1.0/api/auth/signin')
        .send({ emailPhone, password: 'sfrtj54534D@3' });
      expect(response).to.have.status(401);
      expect(response.body.status).to.equal('failed');
      expect(response.body.message).to.equal('Incorrect credential');
    });
    it('should fail when the user does not exist', async () => {
      const response = await chai
        .request(server)
        .post('/v1.0/api/auth/signin')
        .send({ emailPhone: 'unknown@gmail.com', password });
      expect(response).to.have.status(404);
      expect(response.body.status).to.equal('failed');
      expect(response.body.message).to.equal('Incorrect credential');
    });
});

// describe('Authentication on user details', () => {
//     beforeEach(() => {

//     })
//     it('should return user token upon successful login', () => {

//     })
// })