import { injectable } from "inversify";
import { UserPermission } from "@models";
import { IUserPermission } from "@interfaces";

@injectable()
export class UserPermissionService {

    async createUserPermission(userPermissionData: IUserPermission): Promise<IUserPermission | null> {
        const userPermission = await UserPermission.create(userPermissionData);
        return userPermission;
    }

    async getUserPermissions(queryParams: any): Promise<{ data: IUserPermission[], total: number, page: number, limit: number, pages: number }> {
        const { page = 1, limit = 10, sort = 'name', order = 'asc', search = '' } = queryParams;
    
        const query: any = { isDeleted: { $ne: true } };
    
        if (search) {   
            query.name = { $regex: search, $options: 'i' };
        }
    
        const userPermissions = await UserPermission.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
    
        const total = await UserPermission.countDocuments(query);
    
        return {
            total,
            data: userPermissions,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
        };
    }
    

    async updateUserPermission(userPermissionId: string, updateData: any): Promise<IUserPermission | null> {

        const filter = {
            _id: userPermissionId
        }
        const update = {
            $set: updateData
        }
        const options = {
            new: true
        }

        console.log(filter);

        const updatedUserPermission = await UserPermission.findByIdAndUpdate(filter, update, options);
        return updatedUserPermission;
    }

    async deleteUserPermission(userPermissionId:string){
        
        const filter = {
            _id: userPermissionId
        }
        const update = {
            $set: {
                isDeleted : true
            }
        }
        const options = {
            new: true
        }

        const role = await  UserPermission.findByIdAndUpdate(filter, update, options).select("-password");
        return role;
    }

}