import { Request, Response } from "express";
import { UserService } from "../../services";
import { ApiResponse, Logger } from "../../libs";

const findAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { limit, offset } = req.query;
        const attributes = {
            exclude: ["updatedAt", "createdAt", "password"]
        };
        const query = {
            offset: offset ? Number(offset) : 0,
            limit: limit ? Number(limit) : 100,
            attributes,
            order: [["id", "DESC"]], // sort data in descending order using id
            separate: true // sorting will not work if this is missing
        }; // get actual skip and limit from query params

        const user: any = await UserService.findAllUsers(res, query);
        return user;
    } catch (error) {
        Logger.error(error.message);
        return ApiResponse.InternalServerError(
            res,
            "Server Error: Something went wrong"
        );
    }
};

export default findAllUsers;
