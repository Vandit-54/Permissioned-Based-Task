import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { HttpStatusCode } from "@enum";
import { ApiError, ApiResponse } from "@utils";
import { IUserPermission } from "@interfaces";
import { UserPermissionService } from "@services";
import { userPermissionValidationSchema } from "@validations";
import { AuthMiddleware } from "@middlewares";
import { Message, TYPES } from "@constant";

@controller('/user')
export class UserController {
    constructor(@inject(TYPES.UserPermissionService) private userPermissionService: UserPermissionService) { }

    @httpPost('/register')
    async createUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {

            const { roleId, moduleId, read, write, update, canDelete } = req.body;

            const userData: IUserPermission = await userPermissionValidationSchema.validateAsync({ roleId, moduleId, read, write, update, canDelete });

            const userPermissions = await this.userPermissionService.createUserPermission(userData);

            if (!userPermissions) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILURE);
            }

            return res.status(HttpStatusCode.CREATED).json(
                new ApiResponse(HttpStatusCode.OK, userPermissions, Message.CREATE_SUCCESS)
            );
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @httpGet('/getPermissions')
    async getRoles(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const query = req.query
            const roles = await this.userPermissionService.getUserPermissions(query);
            if (!roles) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.READ_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK, roles, Message.SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @httpPut('/update', AuthMiddleware)
    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user.id;

            const { name, email, phoneNumber, address, role } = req.body;

            const userData: IUserPermission = await userPermissionValidationSchema.validateAsync({ name, email, phoneNumber, address, role });

            if (!userData) {
                throw new ApiError(HttpStatusCode.NOT_ACCEPTABLE, Message.VALIDATION_ERROR)
            }

            const updatedUser = await this.userPermissionService.updateUserPermission(userId, userData);

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
            const status = await this.userPermissionService.deleteUserPermission(userId);
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

