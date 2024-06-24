/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config";
import bcrypt from "bcryptjs";

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

export function generateAccountNumber() {
    return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
}

