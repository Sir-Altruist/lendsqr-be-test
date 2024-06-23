import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { WalletServices } from "../../services";
import { Response, Request } from "express";

const wallet = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { error} = SchemaValidation.fundOrWithdraw(req.body)
        if(error) return ApiResponse.AuthenticationError(res, error.details[0].context.label)
        const response: any = await WalletServices.fundingOrWithdrawal(res.locals.user.id, req.body, res)
        return response;
    } catch (error) {
        Logger.error(`Wallet funding/withdrawal error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default wallet;