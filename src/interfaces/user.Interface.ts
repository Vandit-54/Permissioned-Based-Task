import mongoose from "mongoose";

export interface IUser{
    name:string;
    email:string;
    password?:string;
    phoneNumber:number;
    address?:string;
    role?:mongoose.Types.ObjectId;
    isActive?:boolean;
    isDeleted?:boolean;
    isBlocked?:boolean;
    accessToken?():string;
}