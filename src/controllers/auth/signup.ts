import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { AuthServices } from "../../services";
import { Response, Request } from "express";

const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { confirm, ...others } = req.body;
        const { error } = SchemaValidation.signup(req.body)
        if(error) return ApiResponse.AuthenticationError(res, 
            error.details[0].context.label === "confirm"
            ? "Passwords do not match"
            : error.details[0].context.label
        )
        const response: any = await AuthServices.signup(others, res)
        return response;
    } catch (error) {
        Logger.error(`User registration error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default signup;