import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import mongoose from "mongoose";

export class StringToObjectId implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        const notAllow = [null, undefined, '']
        if(!notAllow.includes(value.reportingManager)){
            const objectId = new mongoose.Types.ObjectId(value.reportingManager)
            value.reportingManager = objectId
        }
        else value.reportingManager = null
        if(!notAllow.includes(value.teamLeader)){
            const objectId = new mongoose.Types.ObjectId(value.teamLeader)
            value.teamLeader = objectId
        }
        else value.teamLeader = null
        value.isActive = true
        return value
    }
}