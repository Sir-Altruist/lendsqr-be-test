import chai from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import { expect } from 'chai'
import server from '../src/server'
import { signinData, walletData, transferData } from './dummy'

describe('Wallet Service', () => {
    let user;
    beforeEach(async () => {
        user = await chai
        .request(server)
        .post('/v1.0/api/auth/signin')
        .send(signinData);
    })

    it('should fail if token is missing in header for all wallet endpoints', async () => {
        const response = await chai
          .request(server)
          .patch('/v1.0/api/wallet/*');
        expect(response).to.have.status(401);
        expect(response.body.status).to.equal('failed');
        expect(response.body.data.badToken).to.equal(true);
    });

    describe('Funding or Withdrawal', () => {
        it('should return error if amount or action is empty', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/action')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({ ...walletData, amount: ''})
            expect(response).to.have.status(400);
            expect(response.body.status).to.equal('failed');
            expect(response.body.message).to.be.oneOf(['Amount is required', 'Action type is missing']);
        })

        it('should fail if action value is not fund or withdraw', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/action')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({ ...walletData, action: 'play'})
            expect(response).to.have.status(400);
            expect(response.body.status).to.equal('failed');
            expect(response.body.message).to.equal('Invalid action value')
        })

        it('should fund users\'s wallet', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/action')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send(walletData)
            expect(response).to.have.status(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.data.message).to.equal('Successfully funded wallet')
        })

        it('should withdraw from users\'s wallet', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/action')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({...walletData, action: 'withdraw', amount: 50 })
            expect(response).to.have.status(200);
            expect(response.body.status).to.equal('success')
        })

        it('should return error for insufficient balance', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/action')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({...walletData, action: 'withdraw', amount: 500 })
            expect(response).to.have.status(400);
            expect(response.body.status).to.equal('failed')
            expect(response.body.message).to.equal('Insufficient wallet balance')
        })
    })

    describe('Fund transfer', () => {
        it('should return error if amount or accountNumber is empty', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/transfer')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({ ...transferData, accountNumber: ''})
            expect(response).to.have.status(400);
            expect(response.body.status).to.equal('failed');
            expect(response.body.message).to.be.oneOf(['Amount is required', 'Recipient account number is missing']);
        })

        it('should return error if receipient\'s account number cannot be found', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/transfer')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send(transferData)
            expect(response).to.have.status(404);
            expect(response.body.status).to.equal('failed')
            expect(response.body.message).to.equal('Recipient account not found')
        })

        it('should return error for insufficient balance', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/transfer')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send(transferData)
            expect(response).to.have.status(400);
            expect(response.body.status).to.equal('failed')
            expect(response.body.message).to.equal('Insufficient wallet balance')
        })

        it('should return wallet details after successful transfer', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/transfer')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send(transferData)
            expect(response).to.have.status(200);
            expect(response.body.status).to.equal('success')
            expect(response.body.data.details).to.be.an('object')
            expect(response.body.data.message).to.equal(`Successfully transfered N${transferData.amount}`)
        })

        it('should return error if the recipient\'s account number is the same as sender\'s account number', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/transfer')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({ ...transferData, accountNumber: "8564963388"})
            expect(response).to.have.status(400);
            expect(response.body.status).to.equal('failed')
            expect(response.body.message).to.equal("Source account cannot be the same as destination account")
        })

        it('should return error for minimum amount for transfer', async () => {
            const response = await chai
                .request(server)
                .patch('/v1.0/api/wallet/transfer')
                .auth(`${user?.body?.data?.token}`, { type: 'bearer'})
                .send({ ...transferData, amount: 0 })
            expect(response).to.have.status(403);
            expect(response.body.status).to.equal('failed')
            expect(response.body.message).to.equal("The minimum amount for transfer is N10")
        })
    })
})