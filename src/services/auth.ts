import { ILogin, IUser, StatusCode } from "../interfaces";
import { Response } from "express";
import { UserRepo, WalletRepo } from "../repositories";
import { ApiResponse } from "../libs";
import { Tools } from "../utils";

class AuthServices {
    async signup(payload: IUser, res:Response): Promise<object> {
        const { email, phoneNumber, password, bvn } = payload;
        {/** Check for existing email */}
        const existingEmail = await UserRepo.findByParams(email)
        if(existingEmail) return ApiResponse.Conflict(res, "Email or phone number already exist")
        {/** Check for existing phone number */}
        const existingPhone = await UserRepo.findByParams(phoneNumber)
        if(existingPhone) return ApiResponse.Conflict(res, "Email or phone number already exist")
        const existingBvn = await UserRepo.findByParams(bvn)
        if(existingBvn) return ApiResponse.Conflict(res, "Bvn already exist")
        
        {/** Hash user password */}
        const hashedPassword = await Tools.hashPassword(password)
        payload.password = hashedPassword

        {/** Save record to database */}
        const user: any = await UserRepo.create(payload)
        if(user) await WalletRepo.create({  userId: user?.id, accountNumber: `${Tools.generateAccountNumber()}`})


        {/** Remove password from response */}
        delete user?.password 
        
        return ApiResponse.Success(res, {
            message: `Registration successful`,
            details: user
        }, StatusCode.CREATED)

    }

    async signin(payload: ILogin, res: Response): Promise<object> {
        const { emailPhone, password } = payload;
        const existingUser: any = await UserRepo.findByParams(emailPhone)
        if(!existingUser) return ApiResponse.NotFoundError(res, "Incorrect credential")

        {/** Compare password */}
        const validPassword = await Tools.comparePassword(password, existingUser?.password);
        if (!validPassword) return ApiResponse.AuthorizationError(res, "Incorrect credential");

        {/** generate auth token */}
        const token = Tools.generateToken(existingUser?.id, "1hr");

        {/** Remove password from response */}
        delete existingUser?.password 

        return ApiResponse.Success(res, {
            message: "Login successful",
            token,
            details: existingUser
        });
    }

    async details(id: string, res: Response): Promise<object> {
        const user: any = await UserRepo.findOne(id)
        if(!user) return ApiResponse.NotFoundError(res, "User not found")
        
        {/** Remove password from response */}
        delete user?.password 

        return ApiResponse.Success(res, {
            message: "Successfully retrieved user details",
            details: user
        })
    }
}

export default new AuthServices();