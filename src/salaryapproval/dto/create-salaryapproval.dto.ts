import mongoose from "mongoose"


export class CreateSalaryapprovalDto {
    amount : number
    createdBy?: mongoose.Types.ObjectId
    isAdminApproved : boolean
    isManagerApproved : boolean
    userId : mongoose.Types.ObjectId
    isRejected : boolean
    reasonForRejection? : string
}
