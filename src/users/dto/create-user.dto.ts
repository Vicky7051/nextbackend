import mongoose from "mongoose";

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    role: string;
    salary?: mongoose.Types.ObjectId | string | null;
    reportingManager?: mongoose.Types.ObjectId | string | null;
    teamLeader? : mongoose.Types.ObjectId | string | null;
    createBy : mongoose.Types.ObjectId
    createAt : Date
}
