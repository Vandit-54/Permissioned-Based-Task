import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models';
import { BaseMiddleware } from 'inversify-express-utils';
import { ApiResponse } from '../utils';
import { HttpStatusCode } from '../enum';

export class AuthMiddleware extends BaseMiddleware {

    async handler(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(HttpStatusCode.FORBIDDEN).json(
                new ApiResponse(HttpStatusCode.FORBIDDEN, null, "Access denied. No token provided.")
            )
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN) as JwtPayload;
            if (!decoded) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(
                    new ApiResponse(HttpStatusCode.UNAUTHORIZED, null, "Token verification failed.")
                )
            }
            const userId = decoded.id;
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(HttpStatusCode.NOT_FOUND).json(
                    new ApiResponse(HttpStatusCode.NOT_FOUND, null, "User not found")
                )
            }
            req.user = decoded;
            next();
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(
                    new ApiResponse(HttpStatusCode.UNAUTHORIZED, null, "Invalid Token")
                )
            }
            if (error.name === "TokenExpiredError") {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(
                    new ApiResponse(HttpStatusCode.UNAUTHORIZED, null, "Token Expired")
                )
            }

            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
                new ApiResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, error, "Something went wrong")
            )

        }
    };
}
