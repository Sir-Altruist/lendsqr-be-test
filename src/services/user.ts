import { ILogin, IUser, StatusCode } from "../interfaces";
import { Response } from "express";
import { UserRepo, WalletRepo } from "../repositories";
import { ApiResponse } from "../libs";
import { Tools } from "../utils";

class UserServices {
    async register(payload: IUser, res:Response): Promise<object> {
        const { email, phoneNumber, password } = payload;
        {/** Check for existing email */}
        const existingEmail = await UserRepo.findByParams(email)
        if(existingEmail) return ApiResponse.AuthenticationError(res, "Email is already taken")
        {/** Check for existing phone number */}
        const existingPhone = await UserRepo.findByParams(phoneNumber)
        if(existingPhone) return ApiResponse.AuthenticationError(res, "Phone number is already taken")
        
        {/** Hash user password */}
        const hashedPassword = await Tools.hashPassword(password)
        payload.password = hashedPassword

        {/** Save record to database */}
        const user: any = await UserRepo.create(payload)
        console.log(user)
        if(user) {
            await WalletRepo.create({ userId: user?.id })
        }


        {/** Remove password from response */}
        delete user?.password 
        
        return ApiResponse.Success(res, {
            message: `You've successfully registered`,
            detaila: user
        }, StatusCode.CREATED)

    }

    async login(payload: ILogin, res: Response): Promise<object> {
        const { emailPhone, password } = payload;
        const existingUser: any = await UserRepo.findByParams(emailPhone)
        if(!existingUser) return ApiResponse.NotFoundError(res, "Authentication failed! Incorrect credentials")

        console.log(existingUser)
        {/** Compare password */}
        const validPassword = await Tools.comparePassword(password, existingUser?.password);
        if (!validPassword) return ApiResponse.AuthorizationError(res, "Authentication failed! Incorrect credentials");

        {/** generate auth token */}
        const token = Tools.generateToken(existingUser?.id, "1hr");

        {/** Remove password from response */}
        delete existingUser?.password 

        return ApiResponse.Success(res, {
            message: "You've succesfully logged in",
            token,
            details: existingUser
        });
    }

    async details(id: string, res: Response): Promise<object> {
        const user: any = await UserRepo.findOne(id)
        if(!user) return ApiResponse.NotFoundError(res, "User not found")
        
        return ApiResponse.Success(res, {
            message: "Successfully retrieved user details",
            details: {
                id: user[0]?.id,
                fullName: user[0]?.fullName,
                email: user[0]?.email,
                username: user[0]?.username,
                phoneNumber: user[0]?.phoneNumber,
                wallet: {
                    balance: user[0]?.balance
                }
            }
        })
    }
}

export default new UserServices();