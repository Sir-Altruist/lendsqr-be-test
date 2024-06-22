/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config";
import bcrypt from "bcryptjs";
import { ParsedQs } from "qs";
import { totp } from "otplib";
// import { OtpRepo } from "../repositories";
import { SendMailClient } from "zeptomail";
import { Logger } from "../libs";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
}
export async function comparePassword(
    plainPassword: string,
    hashedPassword: string
) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
export function generateToken(id: string, time: string) {
    return jwt.sign({ id }, env.SECRET_KEY, { expiresIn: time });
}

export function checkToken(req: JwtPayload) {
    if (
        req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
}

export function verifyToken(token: string) {
    return jwt.verify(token, env.SECRET_KEY);
}

export function generateName(req) {
    let filename = "";
    if (req.query === undefined) {
        filename = req.body.businessName;
    } else {
        filename = req.query.type;
    }

    return filename;
}

export function queryBuilder(
    arr: Array<string>,
    value: string | ParsedQs | string[] | ParsedQs[],
    obj: object = {}
) {
    return arr.map((item: string) => {
        obj[item] = value;
    });
}

export function generateOtp(secret: string) {
    totp.options = { digits: 6 };
    return totp.generate(secret);
}

// export async function verifyOtp(user: string, otp: number){
//     const currentDate = new Date();
//     const existingOtp: ResponseType = await OtpRepo.findOne(user, otp);
//     if(!existingOtp || existingOtp.dataValues.expiration < currentDate){
//         return null;
//     }

//     return existingOtp.dataValues.id;
// }

export function compareDates(initialDate: any, today: any) {
    // calculate the difference in milliseconds between the two dates
    const diffInMilliSeconds = Math.abs(today - initialDate);
    // convert milliseconds to days
    // const diffInDays = diffInMilliSeconds / (1000 * 60 * 60 * 24)
    const diffInMins = diffInMilliSeconds / (1000 * 60);
    // console.log('mins: ', diffInMins)
    // Check if difference is greater than or equal to maturity date
    return diffInMins >= 5;
}

export function tokenExpiration() {
    const tokenExpiration: any = new Date();
    return tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);
}

export async function sendEmail(to: string, subject: string, html: any) {
    const client = new SendMailClient({
        url: env.MAIL_URL,
        token: env.MAIL_TOKEN
    });

    try {
        const mail = await client.sendMail({
            from: { address: env.MAIL_DOMAIN, name: "Fapss" },
            to: [
                {
                    email_address: {
                        address: to
                    }
                }
            ],
            subject: subject,
            htmlbody: html
        });
        Logger.info("Email sent successfully");
        return mail;
    } catch (error) {
        Logger.info(`Error sending mail: ${error.message}`);
    }
}
