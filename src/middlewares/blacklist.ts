import { Request, Response, NextFunction } from "express";
import { AxiosError } from "axios";
import { apiConfig, env } from "../config";
import { ApiResponse, Logger } from "../libs";

async function blackList(req: Request, res: Response, next: NextFunction){
    try {
        await apiConfig.get(`${env.LENDSQR_API_BASE_URL}/verification/karma/${req.body.bvn}`)
        next()
    } catch (error) {
        Logger.info(`Blacklist middleware: ${JSON.stringify(error?.response?.data) || JSON.stringify(error?.message)}`)
        if(error instanceof AxiosError) {
            if(error?.response?.data?.message !== "Identity not found in karma") return ApiResponse.Forbidden(res, "Error running blacklist check")
            next()
        } else {
            Logger.error(`Blacklist middleware error: ${error?.message}`)
            return ApiResponse.InternalServerError(res, "Server Error: Something went wrong")
        }
    }
}

export default blackList;