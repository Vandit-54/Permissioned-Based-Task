import mongoose, {Schema} from "mongoose";
import { IRole } from "../interfaces";

const roleSchema : Schema<IRole> = new Schema ({

    name : {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
})

export const Role = mongoose.model<IRole>('Role Schema',roleSchema);