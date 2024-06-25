import { IUser, IWallet } from "../src/interfaces"

export const signupData: IUser = {
    "fullName": "Esho Oluwasegun",
    "email": "altruist@gmail.com",
    "phoneNumber": "08180000000",
    "username": "Altruist",
    "bvn": "12345678900",
    "password": "altruist@1",
    "confirm": "altruist@1"
}

export const signinData = {
    "emailPhone": "altruist1@gmail.com",
    "password": "altruist@1"
}

export const walletData: IWallet = {
    "amount": 100,
    "action": "fund"
}

export const transferData: IWallet = {
    "accountNumber": "1770425472",
    "amount": 50
}