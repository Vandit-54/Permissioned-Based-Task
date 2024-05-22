import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { HttpStatusCode } from "@enum";
import { ApiError, ApiResponse } from "@utils";
import { IModule } from "@interfaces";
import { Message, TYPES, } from "@constant";
import { ModuleService } from "@services";
import { moduleValidationSchema } from "@validations";

@controller('/module')
export class ModuleController {
    constructor(@inject(TYPES.ModuleService) private moduleService: ModuleService) { }

    @httpPost('/create')
    async createRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { name, description } = req.body;
            const moduleData: IModule = await moduleValidationSchema.validateAsync({ name, description });
            const module = await this.moduleService.createModule(moduleData);

            if (!module) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILURE)
            }

            return res.status(HttpStatusCode.CREATED).json(
                new ApiResponse(HttpStatusCode.OK, module, Message.CREATE_SUCCESS)
            )

        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    @httpGet('/getRoles')
    async getRoles(req:Request,res:Response,next:NextFunction):Promise<Response>{
        try {
            const query = req.query
            const modules = await this.moduleService.getModules(query);
            if (!modules) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR,Message.READ_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK,modules,Message.SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }   
    }

    @httpPut('/update/:id')
    async updateRoles(req:Request,res:Response,next:NextFunction):Promise<Response>{
        try {
            const {name,description} = req.body;
            const moduleId = req.query
            const moduleData = await moduleValidationSchema.validateAsync({name,description});
            const module = await this.moduleService.updateModule(moduleData,moduleId);
            if (!module) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR,Message.UPDATE_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK,module,Message.UPDATE_SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @httpDelete('/delete/:id')
    async deleteRole(req:Request,res:Response,next:NextFunction):Promise<Response>{
        try {
            const moduleId = req.query.id as string;
            const module = await this.moduleService.deleteModule(moduleId);
            if (!module) {
                throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR,Message.DELETE_FAILURE)
            }
            return res.status(HttpStatusCode.OK).json(
                new ApiResponse(HttpStatusCode.OK,module,Message.DELETE_SUCCESS)
            )
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}