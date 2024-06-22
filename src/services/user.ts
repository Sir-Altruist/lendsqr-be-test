/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRepo } from "../repositories";
import { Tools } from "../utils";
import { cache } from "../datasources";
import { Response } from "express";
import { ApiResponse } from "../libs";
import { StatusCode } from "../interfaces";

class UserService {
    async register(payload: any, res: Response): Promise<object> {
        const { username, email } = payload;
        const existingEmail = await UserRepo.findByParameter(email);
        if (existingEmail)
            return ApiResponse.Forbidden(res, "Email is already taken");
        const user = await UserRepo.findByParameter(username);
        if (user) return ApiResponse.Forbidden(res, "Username already exists");

        //remove user from cache
        const newUser = await UserRepo.create(payload);
        await cache.del("users");
        return ApiResponse.Success(
            res,
            {
                message: "You've successfully registered",
                details: newUser
            },
            StatusCode.CREATED
        );
    }

    async login(payload: any, res: Response): Promise<object> {
        const { email, password } = payload;
        const user: any = await UserRepo.findByParameter(email);
        if (!user) return ApiResponse.NotFoundError(res, "User does not exist");

        // Compare passwords
        const validPassword = await Tools.comparePassword(password, user.password);

        if (!validPassword) {
            return ApiResponse.AuthenticationError(res, "Password is not correct");
        }

        const accessToken = Tools.generateToken(user?.id, "1m");
        const refresh: any = await Tools.createRefreshToken(user?.id, "3m");
        res.cookie("refresh_token", refresh?.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: true
            // maxAge: 300000
        });
        return ApiResponse.Success(res, {
            message: "You've successfully logged in",
            accessToken,
            // refreshToken: refresh?.token,
            details: user
        });
    }

    async updateUser(id: string, payload: any, res: Response): Promise<object> {
        let cachedData = JSON.parse(await cache.get(`user:${id}`));
        if (!cachedData || cachedData === null) {
            const user = await UserRepo.findOne(id);
            if (!user) return ApiResponse.NotFoundError(res, "User does not exist");
        }

        const updatedUser = await UserRepo.update(id, payload);
        // set user value to cache
        await cache.set(`user:${id}`, JSON.stringify(updatedUser[1][0]), {
            EX: 3600 // expires in 1hr
        });
        cachedData = updatedUser[1][0];
        return ApiResponse.Success(res, {
            message: "User updated successfully",
            details: cachedData
        });
    }

    async findUser(id: string, res: Response): Promise<object> {
    // checks and get user from cache
        let cachedData = JSON.parse(await cache.get(`user:${id}`));
        if (!cachedData || cachedData === null) {
            const user = await UserRepo.findOne(id);
            if (!user) {
                return ApiResponse.NotFoundError(res, "User does not exist");
            }
            // add user to cache
            await cache.set(`user:${id}`, JSON.stringify(user), {
                EX: 3600 // expires in 1hr
            });
            cachedData = user;
        }
        return ApiResponse.Success(res, {
            message: "Successfully retrieved user",
            details: cachedData
        });
    }

    async findAllUsers(
        res: Response,
        query?: {
      offset: number;
      limit: number;
    }
    ): Promise<object> {
        let cachedData: { rows: object[]; count: number } = JSON.parse(
            await cache.get("users")
        );
        if (!cachedData || cachedData?.count === 0) {
            const users = await UserRepo.findAll(query);
            await cache.set(
                `users?skip${query.offset}&limit=${query.limit}`,
                JSON.stringify(users),
                {
                    EX: 3600 // expires in 1hr
                }
            );
            // This allows one to update the redis data from other endpoints
            // await cache.rename(`users:${query}`, "users");
            cachedData = users;
        }
        return ApiResponse.Success(res, {
            message: "Successfully retrieved all users",
            details: cachedData
        });
    }

    async deleteUser(id: string, res: Response): Promise<object> {
        const user = await UserRepo.findOne(id);
        if (!user) return ApiResponse.NotFoundError(res, "User does not exist");

        await cache.del(`user:${id}`);
        await cache.del("users");

        await UserRepo.remove(id);
        return ApiResponse.Success(res, {
            message: "Successfully deleted user",
            details: user
        });
    }
}

export default new UserService();
