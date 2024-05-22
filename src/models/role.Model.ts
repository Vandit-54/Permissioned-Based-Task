import mongoose, {Schema} from "mongoose";
import { IRole } from "@interfaces";

const roleSchema : Schema<IRole> = new Schema ({

    name : {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isDeleted : {
        type: Boolean,
        default:false
    }
})

export const Role = mongoose.model<IRole>('Role',roleSchema);