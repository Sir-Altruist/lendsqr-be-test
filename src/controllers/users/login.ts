import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { UserServices } from "../../services";
import { Response, Request } from "express";

const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { error} = SchemaValidation.login(req.body)
        if(error) return ApiResponse.AuthenticationError(res, error.details[0].context.label)
        const response: any = await UserServices.login(req.body, res)
        return response;
    } catch (error) {
        Logger.error(`User login error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default login;