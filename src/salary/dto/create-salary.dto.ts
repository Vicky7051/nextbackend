import mongoose from "mongoose"

export class CreateSalaryDto {
    amount : number
    createdAt : Date
    creaderBy : mongoose.Types.ObjectId
    adminVerified : boolean
    managerVerified? : boolean
    userId : mongoose.Types.ObjectId

    constructor(partial: Partial<CreateSalaryDto>) {
        Object.assign(this, partial);
    }
}
