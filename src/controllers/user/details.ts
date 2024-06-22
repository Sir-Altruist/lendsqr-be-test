import { Response } from "express";
import { ApiResponse, Logger } from "../../libs";
import { UserService } from "../../services";

const details = async (_, res: Response): Promise<Response> => {
    try {
        const user: any = await UserService.findUser(res.locals.user.id, res);
        return user;
    } catch (error) {
        Logger.error(error.message);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
};

export default details;
