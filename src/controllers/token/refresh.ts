import { Request, Response } from "express";
import { TokenService } from "../../services";
import { ApiResponse, Logger } from "../../libs";
import { TokenExpiredError } from "jsonwebtoken";

const generateAccessToken = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const token: any = await TokenService.generateAccessToken(req, res);
        return token;
    } catch (error) {
        Logger.error(error.message);
        if (error instanceof TokenExpiredError) {
            return ApiResponse.Forbidden(
                res,
                "Refresh token is expired. Kindly login again",
                { badToken: true }
            );
        }
        return ApiResponse.InternalServerError(
            res,
            "Server Error! Something went wrong"
        );
    }
};

export default generateAccessToken;
