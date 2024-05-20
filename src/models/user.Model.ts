import mongoose, {  Schema } from "mongoose";
import { IUser } from "../interfaces";
import { passwordHelper, generateAccessToken } from "../utils";

const userSchema: Schema<IUser> = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        unique: true,
        required: true
    },
    address: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

userSchema.pre("save", passwordHelper);

userSchema.methods.accessToken = generateAccessToken;

export const User = mongoose.model<IUser>('User', userSchema);

