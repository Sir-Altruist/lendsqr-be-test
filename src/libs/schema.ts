import { UserPayload } from "../interfaces";
import Joi from "joi";

const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}|:"<>?])[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?]{8,16}$/;

class SchemaValidation {
    registrationSchema(payload: UserPayload) {
        const user: Joi.ObjectSchema = Joi.object({
            email: Joi.string()
                .label("A valid email is required")
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "ng", "io"] } })
                .required(),
            username: Joi.string()
                .min(3)
                .label("Username is required and not less than three characters")
                .required(),
            password: Joi.string()
                .min(8)
                .label(
                    "A valid password is required with minimum length of 8 characters"
                )
                .pattern(PASSWORD_REGEX)
                .required(),
            confirm: Joi.ref("password")
        }).with("password", "confirm");

        return user.validate(payload);
    }

    loginSchema(payload: UserPayload) {
        const user: Joi.ObjectSchema = Joi.object({
            email: Joi.string()
                .label("Invalid email address")
                .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
                .required(),
            password: Joi.string()
                .min(8)
                .label("Invalid password")
                .pattern(PASSWORD_REGEX)
                .required()
        });

        return user.validate(payload);
    }

    refresh(payload: UserPayload) {
        const schema: Joi.ObjectSchema = Joi.object({
            refreshToken: Joi.string().label("Refresh token is required").required()
        });

        return schema.validate(payload);
    }
}

export default new SchemaValidation();
