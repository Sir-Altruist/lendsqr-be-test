import { Response } from "express";
import { ResponseInterface, StatusCode } from "../interfaces";

class ApiResponse {
    public response: ResponseInterface;

    NotFoundError(res: Response, message: string) {
        this.response = {
            status: "failed",
            message
        };
        return res.status(StatusCode.NOT_FOUND).json(this.response);
    }

    AuthenticationError(res: Response, message: string) {
        this.response = {
            status: "failed",
            message
        };
        return res.status(StatusCode.BAD_REQUEST).json(this.response);
    }

    AuthorizationError(res: Response, message: string, data?: object) {
        this.response = {
            status: "failed",
            message,
            data
        };
        return res.status(StatusCode.UNAUTHORIZED).json(this.response);
    }

    Forbidden(res: Response, message: string, data?: object) {
        this.response = {
            status: "failed",
            message,
            data
        };
        return res.status(StatusCode.FORBIDDEN).json(this.response);
    }

    Conflict(res: Response, message: string){
        this.response = {
            status: "failed",
            message
        }
        return res.status(StatusCode.CONFLICT).json(this.response);
    }

    InternalServerError(res: Response, message: string) {
        this.response = {
            status: "failed",
            message
        };
        if (res.headersSent) {
            return; // Exit function as headers were already sent
        }
        // Send an error response
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(this.response);
    }

    Success(res: Response, data: object, code: number = StatusCode.OK) {
        this.response = {
            status: "success",
            data
        };
        return res.status(code).json(this.response);
    }
}

export default new ApiResponse();
