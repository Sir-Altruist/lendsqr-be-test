import { ApiResponse } from "../libs";
import { RefreshTokenRepo, UserRepo } from "../repositories";
import { Response, Request } from "express";
import { Tools } from "../utils";

class RefreshTokenService {
    async generateAccessToken(req: Request, res: Response): Promise<object> {
        if (!req.cookies.refresh_token)
            return ApiResponse.AuthenticationError(res, "No refresh token in header");
        Tools.verifyToken(req.cookies.refresh_token);
        const tokenData: any = await RefreshTokenRepo.findOne(
            req.cookies.refresh_token
        );
        const user: any = await UserRepo.findOne(tokenData?.user);
        const accessToken = Tools.generateToken(user?.id, "1m");
        return ApiResponse.Success(res, {
            message: "Successfully generated new access token",
            accessToken
        });
    }
}

export default new RefreshTokenService();
