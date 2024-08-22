import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs' 
import { InjectModel } from '@nestjs/mongoose';
import { SALARYS_NAME, USERS_MODEL_NAME } from 'src/Constant/ConnectionName';
import mongoose, { Model, ObjectId, SchemaTypes, Types } from 'mongoose';
import { User } from './Schema/users.schema';
import { Request } from 'express';
import { CustomRequest } from 'src/Interfaces/CustomRequest';
import { ADMIN, EMPLOYEE, MANAGER, TEAM_LEADER } from 'src/Constant/Constant';
import { role } from 'src/enum/role.enum';
import { SalaryService } from 'src/salary/salary.service';
import { CreateSalaryDto } from 'src/salary/dto/create-salary.dto';
import { Salary } from 'src/salary/Schema/salary.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(USERS_MODEL_NAME) private readonly userModel : Model<User>,
    private readonly salaryService : SalaryService
  ){}

  async create(createUserDto: CreateUserDto, req: CustomRequest) {
    try{
      createUserDto.isActive = true
      const salt = await bcrypt.genSalt(10)
      const newPassword = await bcrypt.hash(createUserDto.password, salt)
      createUserDto.password = newPassword

      const user = await this.userModel.create(createUserDto)

      const salaryDto = new CreateSalaryDto({
        amount : req.body.salary,
        creaderBy : new mongoose.Types.ObjectId(req.id),
        adminVerified : false,
        managerVerified : false,
        userId : new mongoose.Types.ObjectId(user.id)
      })

      await this.salaryService.create(salaryDto)

      return user;
    }
    catch(err){
      console.log(err.message)
      throw new BadRequestException(err.message)
    }
  }

  async findByEmail(email : string): Promise<User> {
    try{
      const isUser = await this.userModel.findOne({email})
      return isUser;
    }
    catch(err){
      throw new NotFoundException("Invalid credential.")
    }
  }

  async findAll(req: CustomRequest, pageNumber: number = 1, noOfRows: number = 10): Promise<any> {
    const skip = (pageNumber - 1) * noOfRows;
    const matchCondition = req.role === TEAM_LEADER ? { role: EMPLOYEE } : req.role === MANAGER ? { role: { $in: [EMPLOYEE, TEAM_LEADER, MANAGER] } } : {};
  
    if (req.role === EMPLOYEE) {
      throw new UnauthorizedException("You are not authorized to see the user list.");
    }
  
    const totalRecords = await this.userModel.countDocuments(matchCondition);
    const totalPages = Math.ceil(totalRecords / noOfRows);
    const isLastPage = pageNumber >= totalPages;
  
    const data = await this.userModel.aggregate([
      { $match : {_id : {$ne : req.id}}},
      { $match: matchCondition },
      {
        $lookup: {
          from: SALARYS_NAME,
          localField: '_id',
          foreignField: 'userId',
          as: "salary"
        }
      },
      {
        $addFields: {
          salary: { $reverseArray: "$salary" }
        }
      },
      {
        $lookup: {
          from: USERS_MODEL_NAME,
          localField: "reportingManager",
          foreignField: "_id",
          as: "reportingManagerDetails"
        }
      },
      {
        $lookup: {
          from: USERS_MODEL_NAME,
          localField: "teamLeader",
          foreignField: "_id",
          as: "teamLeaderDetails"
        }
      },
      { $skip: skip },
      { $limit: noOfRows },
    ]);
  
    return {
      data,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNumber,
        isLastPage,
      }
    };
  }
  

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try{
      const isEmail = await this.userModel.findOne({email : updateUserDto.email})
      if(isEmail) throw new ConflictException("Email already used. try another one.")
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    }
    catch(err){
      throw err
    }
  }

  async remove(id: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }


  async searchUser(query: string, req: CustomRequest, pageNumber: number, noOfRows: number): Promise<any> {
    const { role, id } = req;
    const skip = (pageNumber - 1) * noOfRows;
    let matchCondition = {};
  
    if (role === EMPLOYEE) {
      throw new UnauthorizedException("You are not authorized to search a user.");
    } else if (role === TEAM_LEADER) {
      matchCondition = { role: EMPLOYEE };
    } else if (role === MANAGER) {
      matchCondition = { role: { $in: [EMPLOYEE, TEAM_LEADER] } };
    }
  
    const searchCondition = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };
  
    const totalRecords = await this.userModel.countDocuments({ ...matchCondition, ...searchCondition });
    const totalPages = Math.ceil(totalRecords / noOfRows);
    const isLastPage = pageNumber >= totalPages;
  
    const result = await this.userModel.aggregate([
      { $match : {_id : {$ne : id}}},
      { $match: matchCondition },
      { $match: searchCondition },
      {
        $lookup: {
          from: SALARYS_NAME,
          localField: '_id',
          foreignField: 'userId',
          as: "salary"
        }
      },
      {
        $addFields: {
          salary: { $reverseArray: "$salary" }
        }
      },
      {
        $lookup: {
          from: USERS_MODEL_NAME,
          localField: "reportingManager",
          foreignField: "_id",
          as: "reportingManagerDetails"
        }
      },
      {
        $lookup: {
          from: USERS_MODEL_NAME,
          localField: "teamLeader",
          foreignField: "_id",
          as: "teamLeaderDetails"
        }
      },
      { $skip: skip },
      { $limit: noOfRows },
    ]);
  
    return {
      data: result,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNumber,
        isLastPage,
      }
    };
  }
  

  async getAllManager() {
    return await this.userModel.find({role : MANAGER})
  }

  async getAllTeamLeader() {
    return await this.userModel.find({role : TEAM_LEADER})
  }
}
