import { ApiResponse, Logger } from "../libs/";
import { env } from "../config";
import axios from "axios";
import { Response } from "express";

export default class SmsService {
    async sendSms(text: string, to: string, res: Response) {
        try {
            const url = env.HOLLATAGS_URL;
            const user = env.HOLLATAGS_USER;
            const pass = env.HOLLATAGS_PASSWORD;
            const from = "Fapss";
            const msg = text;

            const form = {
                user,
                pass,
                from,
                to,
                msg
            };

            const resposne = await axios.post(url, {
                form
            });
            return resposne;
        } catch (error) {
            Logger.error(error.message);
            return ApiResponse.InternalServerError(res, "SMS network error");
        }
    }
}
