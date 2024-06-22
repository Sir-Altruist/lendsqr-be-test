/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
// import parser from "parse-data-uri";
import path from "path";
// import { Request } from "express";
import DataUri from "datauri/parser";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const parser = new DataUri();
// Initiating a memory storage engine to store files as Buffer objects
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // limiting files size to 5MB
    }
});

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */

export const dataUri = (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file?: Express.Multer.File
): any => {
    if (req.files) {
        return parser.format(
            path.extname(file.originalname).toString(),
            file.buffer
        );
    }
    if (req.file) {
        return parser.format(
            path.extname(req.file.originalname).toString(),
            req.file.buffer
        );
    }
};
