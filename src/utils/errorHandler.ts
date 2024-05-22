import { ApiError } from "./apiError";
import { HttpStatusCode } from "@enum";
import { Response,NextFunction } from "express";

export const customErrorHandler = (error:any, res:Response,next: NextFunction) => {

    if (error.code == 11000) {
        error = new ApiError(HttpStatusCode.CONFLICT, "Duplicate Field Value Enter ")
    }

    if (error.name === 'SyntaxError') {

        error = new ApiError(HttpStatusCode.BAD_REQUEST, 'Unexpected Sytax ')
    }
    if (error.name === 'ValidationError') {

        error = new ApiError(HttpStatusCode.BAD_REQUEST, error.message)
    }

    if (error.name === "CastError") {

        error = new ApiError(HttpStatusCode.BAD_REQUEST, "Please provide a valid id  ")
    }
    if (error.name === "TokenExpiredError") {

        error = new ApiError(HttpStatusCode.UNAUTHORIZED, "Jwt expired  ")
    }
    if (error.name === "JsonWebTokenError") {
        error = new ApiError(HttpStatusCode.UNAUTHORIZED, "Jwt malformed  ")

    }
    console.log("Custom Error Handler => ", error.name, error.message, error.statusCode)

    return res.status(error.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
            success: false,
            error: error.message || "Server Error"
        })

}

