import { IWallet, StatusCode } from "../interfaces";
import { Response } from "express";
import { UserRepo, WalletRepo } from "../repositories";
import { ApiResponse } from "../libs";

class WalletServices {
    async fundingOrWithdrawal(userId: string, payload: IWallet,  res: Response){
        const { amount, action } = payload;
        const allowedActions = ["fund", "withdraw"]
        if(!allowedActions.includes(action)) return ApiResponse.AuthenticationError(res, "Invalid action value")
        const user: any = await UserRepo.findOne(userId)
        if(!user) return ApiResponse.NotFoundError(res, "User not found")
        
        {/** Update wallet balance */}
        if(action === "fund") {
            await WalletRepo.fund(user?.walletId, amount)
        } else {
            if(amount < 10) return ApiResponse.Forbidden(res, "The minimum amount withdrawable is N10")
            if(amount > user?.balance) return ApiResponse.AuthenticationError(res, "Insufficient wallet balance")
            await WalletRepo.withdraw(user?.walletId, amount) 
        }
        
        const walletInfo = await WalletRepo.find(user?.walletId)
        return ApiResponse.Success(res, {
            message: action === "fund" ? `Successfully funded wallet` : `Successfully withdrew N${amount} from wallet`,
            details: walletInfo
        })
    }

    async fundTransfer(senderId: string, payload: IWallet, res: Response) {
        const { amount, accountNumber } = payload;
        const sender: any = await UserRepo.findOne(senderId)
        if(!sender) return ApiResponse.NotFoundError(res, "User not found")
        const recipient: any = await WalletRepo.find(accountNumber)
        if(!recipient) return ApiResponse.NotFoundError(res, "Recipient account not found")
        if(accountNumber === sender?.accountNumber) return ApiResponse.AuthenticationError(res, "Source account cannot be the same as destination account")
        if(amount < 10) return ApiResponse.Forbidden(res, "The minimum amount for transfer is N10")
        if(amount > sender?.balance) return ApiResponse.AuthenticationError(res, "Insufficient wallet balance")
        {/** Update recipient balance */}
        await WalletRepo.fund(recipient?.id, amount) 

        {/** Update sender balance */}
        await WalletRepo.withdraw(sender?.walletId, amount) 

        const walletInfo = await WalletRepo.find(sender?.walletId)
        return ApiResponse.Success(res, {
            message: `Successfully transfered N${amount}`,
            details: walletInfo
        })
    }
}

export default new WalletServices();