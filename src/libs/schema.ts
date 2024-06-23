import ApiResponse from "./response";
import { ILogin, IUser, IWallet } from "../interfaces";
import Joi from "joi";
import { Response } from "express";

const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}|:"<>?])[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?]{8,16}$/;

const PHONE_REGEX = /^0(7|8|9)(0|1)\d{8}$/;
const BVN_REGEX = /[0-9]\d{11}$/;

class SchemaValidation {
    registration(payload: IUser) {
        const schema: Joi.ObjectSchema = Joi.object({
            email: Joi.string()
                .min(3)
                .label("A valid email address is required")
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "ng", "io"] } })
                .required(),
            fullName: Joi.string()
                .label("Full name is required")
                .required(),
            phoneNumber: Joi.string()
                .min(11)
                .max(11)
                .label("Phone number is required")
                .pattern(PHONE_REGEX)
                .required(),
            bvn: Joi.string().min(11).max(11)
                .label("Bvn is required and must be 11 characters")
                .required(),
            username: Joi
                .string()
                .min(3)
                .label("Username is required and not less than three characters")
                .optional(),
            password: Joi.string()
                .min(8)
                .label(
                    "A valid password is required with minimum length of 8 characters"
                )
                .pattern(PASSWORD_REGEX)
                .required(),
            confirm: Joi.ref("password")
        }).with("password", "confirm").label("Confirm password is required");

        return schema.validate(payload)
    }

    login(payload: ILogin) {
        const schema: Joi.ObjectSchema = Joi.object({
            emailPhone: Joi.string()
                .label("Email or Phone number is required")
                .required(),
            password: Joi.string()
                .min(8)
                .label("Invalid password")
                .pattern(PASSWORD_REGEX)
                .required()
        });

        return schema.validate(payload)
    }

    fundOrWithdraw(payload: IWallet){
        const schema: Joi.ObjectSchema = Joi.object({
            amount: Joi.number()
                .label("Amount is required")
                .required(),
            action: Joi.string().label("Action type is missing").required()
        });

        return schema.validate(payload)
    }

    fundTransfer(payload: IWallet){
        const schema: Joi.ObjectSchema = Joi.object({
            amount: Joi.number()
                .label("Amount is required")
                .required(),
            accountNumber: Joi.string().label("Recipient account number is missing").required()
        })

        return schema.validate(payload)
    }
}

export default new SchemaValidation();
