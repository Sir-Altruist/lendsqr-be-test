import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { AuthServices } from "../../services";
import { Response, Request } from "express";

const signin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { error} = SchemaValidation.signin(req.body)
        if(error) return ApiResponse.AuthenticationError(res, error.details[0].context.label)
        const response: any = await AuthServices.signin(req.body, res)
        return response;
    } catch (error) {
        Logger.error(`User signin error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default signin;