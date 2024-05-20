import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { HttpStatusCode } from "../enum";
import { ApiError, ApiResponse } from "../utils";
import { IUser } from "../interfaces";
import { UserService } from "../services";
import { userValidationSchema } from "../validations";
import bcrypt from 'bcryptjs';
import { AuthMiddleware } from "../middlewares";
import { Message,TYPES } from "../constants";


@controller('/user')
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) { }

    @httpPost('/register')
    async createUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {

            const { name, email, password, phoneNumber, address, role } = req.body;

            const userData: IUser = await userValidationSchema.validateAsync({ name, email, password, phoneNumber, address, role });

            if (!userData) {
                throw new ApiError(HttpStatusCode.NOT_ACCEPTABLE, Message.VALIDATION_ERROR)
            }

            const user = await this.userService.createUser(userData);

            if (!user) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILURE);
            }

            return res.status(HttpStatusCode.CREATED).json(
                new ApiResponse(HttpStatusCode.OK, user, Message.CREATE_SUCCESS)
            );
        } catch (error) {
            console.log(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }

    }

    @httpGet('/login')
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await this.userService.login(email);
            if (!user) {
                return res.status(HttpStatusCode.NOT_FOUND).json({ message: Message.NOT_FOUND });
            }
            const comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: Message.PASSWORD_VALIDATION });
            }

            const token = user.accessToken();

            if (!token) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: Message.GENERIC_ERROR });
            }

            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.ACCEPTED, { loggedInUser: user, token: token },Message.LOGGED_IN_SUCCESS)
            );
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @httpPut('/update', AuthMiddleware)
    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user.id;

            const { name, email, phoneNumber, address, role } = req.body;

            const userData: IUser = await userValidationSchema.validateAsync({ name, email, phoneNumber, address, role });

            if (!userData) {
                throw new ApiError(HttpStatusCode.NOT_ACCEPTABLE, Message.VALIDATION_ERROR)
            }

            const updatedUser = await this.userService.updateUser(userId, userData);

            if (!updatedUser) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.UPDATE_FAILURE)
            }

            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK, { updatedUser: updatedUser }, Message.UPDATE_SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @httpDelete('/delete', AuthMiddleware)
    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user.id;
            const status = await this.userService.deleteUser(userId);
            if (!status) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.DELETE_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK, '', Message.DELETE_SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

}       