import mongoose from "mongoose";

export interface IUserPermission {
    roleId:mongoose.Types.ObjectId;
    moduleId:mongoose.Types.ObjectId;
    read: boolean;
    write: boolean;
    update:boolean;
    delete:boolean;
} 