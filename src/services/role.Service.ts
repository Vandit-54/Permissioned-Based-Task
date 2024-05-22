import { injectable } from "inversify";
import { Role } from "@models";
import { IRole } from "@interfaces";

@injectable()
export class RoleService {

    async createRole(roleData: IRole): Promise<IRole | null> {
        const role = await Role.create(roleData);
        return role;
    }

    async getRoles(queryParams: any): Promise<{ data: IRole[], total: number, page: number, limit: number, pages: number }> {
        const { page = 1, limit = 10, sort = 'name', order = 'asc', search = '' } = queryParams;
    
        const query: any = { isDeleted: { $ne: true } };
    
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
    
        const roles = await Role.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
    
        const total = await Role.countDocuments(query);
    
        return {
            data: roles,
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
        };
    }
    

    async updateRole(roleId: string, updateData: any): Promise<IRole | null> {

        const filter = {
            _id: roleId
        }
        const update = {
            $set: updateData
        }
        const options = {
            new: true
        }

        console.log(filter);

        const updatedRole = await Role.findByIdAndUpdate(filter, update, options);
        return updatedRole;
    }

    async deleteRole(roleId:string){
        
        const filter = {
            _id: roleId
        }
        const update = {
            $set: {
                isDeleted : true
            }
        }
        const options = {
            new: true
        }

        const role = await  Role.findByIdAndUpdate(filter, update, options).select("-password");
        return role;
    }

}