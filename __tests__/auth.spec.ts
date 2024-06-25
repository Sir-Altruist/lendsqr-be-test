import chai from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import { expect } from 'chai'
import server from '../src/server'
import { signupData, signinData } from './dummy'

describe('Authentication Service', () => {
  describe('Signup', () => {
      it('should successfully signup a new user', async () => {
          const response = await chai
              .request(server)
              .post('/v1.0/api/auth/signup')
              .set('Content-Type', 'application/json')
              .send(signupData);
          expect(response).to.have.status(201)
          expect(response.body.status).to.equal('success')
          expect(response.body.data).to.be.an('object')
          expect(response.body.data.details.username).to.be.a('string')
      })
  
      it('should return a validation error when supplied with an empty email or phone number', async () => {
          const response = await chai
            .request(server)
            .post('/v1.0/api/auth/signup')
            .send({ ...signupData, emailPhone: '' });
          expect(response).to.have.status(400);
          expect(response.body.status).to.equal('failed');
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('Please enter a valid email address');
      })
  
      it('should return an error when an existing user\'s email is supplied', async () => {
          const response = await chai
            .request(server)
            .post('/v1.0/api/auth/signup')
            .send(signupData);
          expect(response).to.have.status(409);
          expect(response.body.status).to.equal('failed');
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(`Email or phone number already exist`);
      });
  })
  
  describe('Signin', () => {
      const { emailPhone, password } = signinData
      it('should succesfully login an existing user with emailOrPhoneNumber and password', async () => {
        const response = await chai
          .request(server)
          .post('/v1.0/api/auth/signin')
          .send(signinData);
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
  
  describe('User details', () => {
    let user;
      beforeEach(async () => {
        user = await chai
          .request(server)
          .post('/v1.0/api/auth/signin')
          .send(signinData);
      })
      it('should return user details upon successful login', async () => {
        const response = await chai
          .request(server)
          .get('/v1.0/api/auth/info')
          .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
        expect(response).to.have.status(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.message).to.equal('Successfully retrieved user details');
        expect(response.body.data.details).to.be.an('object');
        expect(response.body.data.details).to.have.property('fullName');
      })
      it('should fail to return user details if token is missing in header', async () => {
        const response = await chai
          .request(server)
          .get('/v1.0/api/auth/info');
        expect(response).to.have.status(401);
        expect(response.body.status).to.equal('failed');
        expect(response.body.data.badToken).to.equal(true);
      });
  })

})