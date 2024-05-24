import { injectable } from "inversify";
import { Module } from "@models";
import { IModule } from "@interfaces";

@injectable()
export class ModuleService {

    async createModule(roleData: IModule): Promise<IModule | null> {
        const role = await Module.create(roleData);
        return role;
    }

    async getModules(queryParams: any): Promise<{ data: IModule[], total: number, page: number, limit: number, pages: number }> {

        const { page = 1, limit = 10, sort = 'name', order = 'asc', search = '' } = queryParams;

        const query: any = { isDeleted: { $ne: true } };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const modules = await Module.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Module.countDocuments(query);

        return {
            total,
            data: modules,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
        };
    }

    async updateModule(moduleId: string, updateData: any): Promise<IModule | null> {

        const filter = {
            _id: moduleId
        }
        const update = {
            $set: updateData
        }
        const options = {
            new: true
        }

        const updatedModule = await Module.findByIdAndUpdate(filter, update, options);
        return updatedModule;
    }

    async deleteModule(moduleId:string){
        
        const filter = {
            _id: moduleId
        }
        const update = {
            $set: {
                isDeleted : true,
                isActive : false
            }
        }
        const options = {
            new: true
        }

        const module = await  Module.findByIdAndUpdate(filter, update, options).select("-password");
        return module;
    }

}