import mongoose, {Schema} from "mongoose";
import { IUserPermission } from "@interfaces";

const userPermissionSchema: Schema<IUserPermission> = new Schema ({
    
    roleId: {
        type:Schema.Types.ObjectId,
        ref:'Role',
        required:true
    },
    moduleId:{
        type:Schema.Types.ObjectId,
        ref:'Module',
        required:true
    },
    read: {
        type: Boolean,
        default:false
    },
    write: {
        type: Boolean,
        default:false
    },
    update:{
        type: Boolean,
        default:false
    },
    delete:{
        type: Boolean,
        default:false
    },
})

export const userPermission = mongoose.model<IUserPermission>('UserPermission',userPermissionSchema)