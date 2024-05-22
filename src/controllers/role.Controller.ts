import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { HttpStatusCode } from "@enum";
import { ApiError, ApiResponse } from "@utils";
import { IRole } from "@interfaces";
import { Message, TYPES, } from "@constant";
import { RoleService } from "@services";
import { roleValidationSchema } from "@validations";

@controller('/role')
export class RoleController {
    constructor(@inject(TYPES.RoleService) private roleService: RoleService) { }

    @httpPost('/create')
    async createRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { name, description } = req.body;
            const roleData: IRole = await roleValidationSchema.validateAsync({ name, description });
            const role = await this.roleService.createRole(roleData);

            if (!role) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILURE)
            }

            return res.status(HttpStatusCode.CREATED).json(
                new ApiResponse(HttpStatusCode.OK, role, Message.CREATE_SUCCESS)
            )

        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    @httpGet('/getRoles')
    async getRoles(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const query = req.query
            const roles = await this.roleService.getRoles(query);
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

    @httpPut('/update')
    async updateRoles(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { name, description } = req.body;
            const roleId = req.query.id as string;
            const roleData = await roleValidationSchema.validateAsync({ name, description });
            const role = await this.roleService.updateRole(roleId, roleData);
            if (!role) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.UPDATE_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK, role, Message.UPDATE_SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @httpDelete('/delete')
    async deleteRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const roleId = req.query.id as string;
            const role = await this.roleService.deleteRole(roleId);
            if (!role) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.DELETE_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK, role, Message.DELETE_SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}