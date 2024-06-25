import { ApiResponse, Logger } from "../../libs";
import { AuthServices } from "../../services";
import { Response, Request } from "express";

const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { confirm, ...others } = req.body;
        const response: any = await AuthServices.signup(others, res)
        return response;
    } catch (error) {
        Logger.error(`User signup error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default signup;