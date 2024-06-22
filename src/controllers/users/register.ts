import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { UserServices } from "../../services";
import { Response, Request } from "express";

const registration = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { confirm, ...others } = req.body;
        const { error } = SchemaValidation.registration(req.body)
        if(error) return ApiResponse.AuthenticationError(res, 
            error.details[0].context.label === "confirm"
            ? "Passwords do not match"
            : error.details[0].context.label
        )
        const response: any = await UserServices.register(others, res)
        return response;
    } catch (error) {
        Logger.error(`User registration error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default registration;