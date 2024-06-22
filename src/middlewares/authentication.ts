import { Logger, ApiResponse } from "../libs";
import { Response, Request, NextFunction } from "express";
import { Tools } from "../utils";
import { TokenExpiredError } from "jsonwebtoken";

async function authentication(req: Request, res: Response, next: NextFunction) {
    try {
        const token = Tools.checkToken(req);
        if (!token || token === null) {
            return ApiResponse.AuthorizationError(
                res,
                "Authorization denied! No token in header",
                { badToken: true }
            );
        }

        res.locals.user = Tools.verifyToken(token);
        next();
    } catch (error) {
        Logger.error(`${error.message}`);
        if (error instanceof TokenExpiredError) {
            return ApiResponse.AuthorizationError(
                res,
                "Authorization denied! Access token expired",
                { badToken: true }
            );
        }
        return ApiResponse.AuthorizationError(
            res,
            "Authorization denied! Invalid or bad token in header"
        );
    }
}

export default authentication;
