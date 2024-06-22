import { Response } from "express";
import { UserService } from "../../services";
import { ApiResponse, Logger } from "../../libs";

const deleteUser = async (_, res: Response): Promise<Response> => {
    try {
        const deletedUser: any = await UserService.deleteUser(
            res.locals.user.id,
            res
        );
        return deletedUser;
    } catch (error) {
        Logger.error(error.message);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
};

export default deleteUser;
