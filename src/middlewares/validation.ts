import { Request, Response, NextFunction  } from "express";
import { ApiResponse, SchemaValidation } from "../libs";

function validation(req: Request, res: Response, next: NextFunction) {
    const { error } = SchemaValidation.signup(req.body)
        if(error) return ApiResponse.AuthenticationError(res, 
            error.details[0].context.label === "confirm"
            ? "Passwords do not match"
            : error.details[0].context.label
        )
    next()
}

export default validation;