import mongoose, { Document, Schema } from "mongoose";

export interface Salary extends Document{
    amount : number
    createdAt : Date
    creaderBy : mongoose.Types.ObjectId
    adminVerified : boolean
    managerVerified? : boolean
    userId : mongoose.Types.ObjectId
}

export const SalarySchema = new Schema<Salary>({
    amount : {
        type : Number,
        required : true
    },

    createdAt : {
        type : Date,
        default : Date.now(),
    },

    adminVerified : {
        type : Boolean,
        default : false
    },

    managerVerified : {
        type : Boolean,
        default : false
    },

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    creaderBy : {
        type : mongoose.Schema.Types.ObjectId
    }

})