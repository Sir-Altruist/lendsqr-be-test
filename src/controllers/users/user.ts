import { ApiResponse, Logger, SchemaValidation } from "../../libs";
import { UserServices } from "../../services";
import { Response, Request } from "express";

const userInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: any = await UserServices.details(res.locals.user.id, res)
        return response;
    } catch (error) {
        Logger.error(`User details retrieval error: ${error.message}`);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
}

export default userInfo;