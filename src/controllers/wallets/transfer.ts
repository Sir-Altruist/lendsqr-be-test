import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { WalletServices } from "../../services";
import { Response, Request } from "express";

const fundTransfer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { error} = SchemaValidation.fundTransfer(req.body)
        if(error) return ApiResponse.AuthenticationError(res, error.details[0].context.label)
        const response: any = await WalletServices.fundTransfer(res.locals.user.id, req.body, res)
        return response;
    } catch (error) {
        Logger.error(`Fund transfer error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default fundTransfer;