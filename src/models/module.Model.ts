import mongoose, {Schema} from "mongoose";
import { IModule } from "@interfaces";

const moduleSchema :Schema<IModule> = new Schema({

    name :{
        type: String,
        required: true,
    },
    description :{
        type:String,
        required:true
    },
    isActive : {
        type: Boolean,
        default: true
    },
    isDeleted : {
        type: Boolean,
        default:false
    }

})

export const Module = mongoose.model<IModule>('Module',moduleSchema)