import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UnauthorizedException, Put, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SalaryapprovalService } from './salaryapproval.service';
import { CreateSalaryapprovalDto } from './dto/create-salaryapproval.dto';
import { UpdateSalaryapprovalDto } from './dto/update-salaryapproval.dto';
import { CustomRequest } from 'src/Interfaces/CustomRequest';
import mongoose from 'mongoose';
import { Response } from 'express';
import { ADMIN, EMPLOYEE, MANAGER, TEAM_LEADER } from 'src/Constant/Constant';
import { SalaryService } from 'src/salary/salary.service';
import { CreateSalaryDto } from 'src/salary/dto/create-salary.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('salaryapproval')
export class SalaryapprovalController {
  constructor(
    private readonly salaryapprovalService: SalaryapprovalService,
    private readonly salaryService: SalaryService,
    private readonly userService : UsersService
  ) {}

  @Post()
  async create(@Body() createSalaryapprovalDto: CreateSalaryapprovalDto, @Req() req : CustomRequest, @Res() res : Response) {
    createSalaryapprovalDto.createdBy = new mongoose.Types.ObjectId(req.id)
    createSalaryapprovalDto.userId = new mongoose.Types.ObjectId(createSalaryapprovalDto.userId)
    if(req.role === ADMIN){
      createSalaryapprovalDto.isManagerApproved = true
      createSalaryapprovalDto.isAdminApproved = false
    }
    else if(req.role === MANAGER){
      createSalaryapprovalDto.isManagerApproved = true
    }
    else if(req.role === EMPLOYEE){
      throw new UnauthorizedException("You are not authorize to update salary.")
    }
    try{
      const data = await this.salaryapprovalService.create(createSalaryapprovalDto);
      if(req.role === ADMIN){
        const newSalary = await this.updateStatus(data._id.toString(), data, req, res)
        return res.status(200).json({
          status : true,
          message : "Salary updated.",
          salary : newSalary
        })
      }
      return res.status(200).json({
        status : true,
        message : "Salary update approval request sended.",
        salary : data
      })
    }
    catch(err){
      throw err
    }
  }

  @Put(':id')
  async updateStatus(@Param('id') id : string, @Body() updateSalaryapprovalDto : UpdateSalaryapprovalDto, @Req() req : CustomRequest, @Res() res : Response){
    if(req.role === ADMIN){
      updateSalaryapprovalDto.isAdminApproved = true
      updateSalaryapprovalDto.isManagerApproved = true
    }
    else if(req.role === MANAGER){
      updateSalaryapprovalDto.isManagerApproved = true
    }
    else if(req.role === EMPLOYEE || req.role === TEAM_LEADER){
      throw new UnauthorizedException("You are not authorize to change the status of approval.")
    }
    try{
      const data = await this.salaryapprovalService.update(id, updateSalaryapprovalDto, req)
      if(data.isAdminApproved && data.isManagerApproved){
        const createSalaryDto = new CreateSalaryDto({
          amount : data.amount,
          creaderBy : data.createdBy,
          adminVerified : true,
          managerVerified : true,
          userId : data.userId,
          createdAt : data.createdAt
        })
        try{
          const response = await this.salaryService.create(createSalaryDto)
          const updateUserDto = new UpdateUserDto({
            salary : response._id
          })
          const updatedSalaryToUser = this.userService.update(response.userId.toString(), updateUserDto)
          await this.salaryapprovalService.remove(data._id.toString())
        }
        catch (err) {
          throw new BadRequestException("Salary not updated.")
        }
      }
      res.status(200).json({
        status : true,
        message : "Salary status changed.",
        salary : data
      })
    }
    catch(err) {throw err}
  }

  @Get(':pageNumber/:noOfRows')
  async findAll(@Param('pageNumber') pageNumber: number, @Param('noOfRows') noOfRows : number, @Req() req : CustomRequest, res : Response){
    return await this.salaryapprovalService.findAll(req, +pageNumber, +noOfRows)
  }

  @Put('reject/:id')
  async reject(@Param('id') id : string, @Body() updateSalaryapprovalDto : UpdateSalaryapprovalDto, @Req() req : CustomRequest, @Res() res: Response){
    const {role} = req
    if(role == ADMIN || role == MANAGER){
      updateSalaryapprovalDto.isRejected = true
      try{
        console.log(updateSalaryapprovalDto)
        const data =  await this.salaryapprovalService.reject(id, updateSalaryapprovalDto)
        return res.status(200).json({
          status : true, 
          message : "Approval Rejected.",
          approval : data
        })
      }
      catch(err){
        throw err
      }
    }
    else throw new UnauthorizedException("You are not authorize to access this request.")
  }

  @Get('rejectedLogs')
  async getRejected(@Req() req : CustomRequest, @Res() res : Response) {
    try{
      const response = await this.salaryapprovalService.getRejected(req)
      return res.status(200).json({
        status : true,
        message : "User List",
        approval : response.reverse()
      })
    }
    catch(err){
      throw new InternalServerErrorException("Internal server error.")
    }
  }
}
