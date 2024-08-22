import mongoose, { Document, Schema } from "mongoose"

export interface SalaryApproval extends Document {
    amount : number
    createdBy?: mongoose.Types.ObjectId
    isAdminApproved : boolean
    isManagerApproved : boolean
    userId : mongoose.Types.ObjectId
    createdAt : Date
    isRejected : boolean
    reasonForRejection? : string
}

export const SalaryApprovalSchame = new Schema<SalaryApproval>({
    amount : {
        type : Number,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    isAdminApproved : {
        type : Boolean,
        default : false
    },
    isManagerApproved : {
        type : Boolean,
        default : false
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    isRejected : {
        type : Boolean,
        default : false
    },
    reasonForRejection : {
        type : String
    }
})