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
            if(amount > user?.balance) return ApiResponse.AuthenticationError(res, "Insufficient wallet balance")
            await WalletRepo.withdraw(user?.walletId, amount) 
        }
        
        const walletInfo = await WalletRepo.find(user?.walletId)
        return ApiResponse.Success(res, {
            message: action === "fund" ? `Successfully funded user wallet` : `Successfully withdrew N${amount} from wallet`,
            details: walletInfo
        })
    }

    async fundTransfer(senderId: string, payload: IWallet, res: Response) {
        const { amount, recipientId } = payload;
        const sender: any = await UserRepo.findOne(senderId)
        if(!sender) return ApiResponse.NotFoundError(res, "User not found")
        const recipient: any = await UserRepo.findOne(recipientId)
        if(!recipient) return ApiResponse.NotFoundError(res, "Recipient not found")
        
        if(recipient?.id === sender?.id) return ApiResponse.AuthenticationError(res, "You cannot transfer to the same account sending the fund")
        {/** Update recipient balance */}
        await WalletRepo.fund(recipient?.walletId, amount) 

        {/** Update sender balance */}
        await WalletRepo.withdraw(sender?.walletId, amount) 

        const walletInfo = await WalletRepo.find(sender?.walletId)
        return ApiResponse.Success(res, {
            message: `Successfully transfered N${amount} to ${recipient?.fullName}`,
            details: walletInfo
        })
    }
}

export default new WalletServices();