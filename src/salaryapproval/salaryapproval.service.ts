import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSalaryapprovalDto } from './dto/create-salaryapproval.dto';
import { UpdateSalaryapprovalDto } from './dto/update-salaryapproval.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SALARYS_APPROVAL_NAME, USERS_MODEL_NAME } from 'src/Constant/ConnectionName';
import { SalaryApproval } from './schema/SalaryApproval.schema';
import { Model } from 'mongoose';
import { CustomRequest } from 'src/Interfaces/CustomRequest';
import { ADMIN, EMPLOYEE, MANAGER, TEAM_LEADER } from 'src/Constant/Constant';

@Injectable()
export class SalaryapprovalService {
  constructor(
    @InjectModel(SALARYS_APPROVAL_NAME) private readonly salaryApprovalModel : Model<SalaryApproval>
  ){}
  async create(createSalaryapprovalDto: CreateSalaryapprovalDto) {
    try{
      if(isNaN(createSalaryapprovalDto.amount)) throw new BadRequestException("Salary must be in positive number.")
      const isRequest = await this.salaryApprovalModel.findOne({userId : createSalaryapprovalDto.userId, isRejected : false})
      if(isRequest) throw new BadRequestException("Your have already requested for this update.")
      const request = await this.salaryApprovalModel.create(createSalaryapprovalDto)
      return request;
    }
    catch(err){
      throw err
    }
  }

  async findAll(req: CustomRequest, pageNumber: number = 1, noOfRows: number = 10) {
    const { role } = req;

    const skip = (pageNumber - 1) * noOfRows;
    const limit = noOfRows;

    if (role === MANAGER) {
        try {
            const data = await this.salaryApprovalModel.aggregate([
                { $match: { isManagerApproved: false } },
                { $match: { isRejected: false } },
                {
                    $lookup: {
                        from: USERS_MODEL_NAME,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                { $skip: skip },
                { $limit: limit }
            ])
            const totalRecords = await this.salaryApprovalModel.countDocuments({
              isManagerApproved: false,
              isRejected: false,
            })

            const totalPages = Math.ceil(totalRecords / noOfRows);
            const isLastPage = pageNumber >= totalPages;

            return {
                data,
                pagination: {
                    totalRecords,
                    totalPages,
                    currentPage: pageNumber,
                    isLastPage
                }
            };
        } catch (err) {
            throw new BadRequestException("No Result found.");
        }
    } else if (role === ADMIN) {
        try {
            const data = await this.salaryApprovalModel.aggregate([
                { $match : { isManagerApproved : true }},
                { $match: { isRejected: false } },
                {
                    $lookup: {
                        from: USERS_MODEL_NAME,
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                { $skip: skip },
                { $limit: limit }
            ])
            const totalRecords = await this.salaryApprovalModel.countDocuments({

                isRejected: false
            })

            const totalPages = Math.ceil(totalRecords / noOfRows);
            const isLastPage = pageNumber >= totalPages;

            return {
                data,
                pagination: {
                    totalRecords,
                    totalPages,
                    currentPage: pageNumber,
                    isLastPage
                }
            };
        } catch (err) {
            throw new BadRequestException("No Result found.");
        }
    } else {
        throw new UnauthorizedException("You are not authorized to access approval.");
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} salaryapproval`;
  }

  async update(id: string, updateSalaryapprovalDto: UpdateSalaryapprovalDto, req : CustomRequest) {
    try{
      const response = await this.salaryApprovalModel.findByIdAndUpdate(id, updateSalaryapprovalDto, {new : true})
      return response
    }
    catch(err){
      throw new BadRequestException("Salary status not updated.")
    }    
  }

  async remove(id: string) {
    try{
      const response = await this.salaryApprovalModel.findByIdAndDelete(id)
      return response
    }
    catch(err){
      throw new BadRequestException("Salary Approval not removed.")
    }
  }

  async reject(id: string, updateSalaryapprovalDto: UpdateSalaryapprovalDto) {
    try{
      const response = await this.salaryApprovalModel.findByIdAndUpdate(id, updateSalaryapprovalDto, {new : true})
      return response
    }
    catch(err){
      throw new BadRequestException("Salary approval not rejected.")
    }
  }

  async getRejected(req : CustomRequest) {
    const {role, id} = req
    try{
      const data = await this.salaryApprovalModel.find({userId : id})
      return data
    }
    catch(err){
      console.log(err)
      throw new InternalServerErrorException("Internal server error.")
    }
  }
}
