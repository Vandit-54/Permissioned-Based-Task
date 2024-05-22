import { injectable } from "inversify";
import { User } from "@models";
import { IUser } from "@interfaces";

@injectable()
export class UserService {

    async createUser(userData: IUser): Promise<IUser | null> {
        const user = await User.create(userData);
        return user;
    }

    async login(email: IUser): Promise<IUser | null> {
        const user = await User.findOne({ email });
        return user;
    }

    async updateUser(userId: string, updateData: any): Promise<IUser | null> {
        delete updateData.password;

        const filter = {
            _id: userId
        }
        const update = {
            $set: {
                name: updateData.name,
                email: updateData.email,
                phoneNumber: updateData.phoneNumber,
                address: updateData.address,
                role: updateData.role
            }
        }
        const options = {
            new: true
        }

        const updatedUser = await User.findByIdAndUpdate(filter, update, options).select("-password");
        return updatedUser;
    }

    async deleteUser(userId: string): Promise<any> {

        const filter = {
            _id: userId
        }
        const update = {
            $set: {
                isDeleted : true
            }
        }
        const options = {
            new: true
        }


        const user = await  User.findByIdAndUpdate(filter, update, options).select("-password");
        return user;
    }
}