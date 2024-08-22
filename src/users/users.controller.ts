import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UnauthorizedException, Res, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { CustomRequest } from 'src/Interfaces/CustomRequest';
import { ADMIN, EMPLOYEE, MANAGER, TEAM_LEADER } from 'src/Constant/Constant';
import { StringToObjectId } from 'src/Transform/StringToObjectId';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(new StringToObjectId()) createUserDto: CreateUserDto, @Req() req : CustomRequest, @Res() res : Response) {
    try{
      const user = await this.usersService.create(createUserDto, req);
      res.status(200).json({
        status : true,
        message : "User added successfully.",
        user
      })
    }
    catch(err){
      throw err
    }
  }

  @Get('getAll/:pageNumber/:noOfRows')
  getAll(@Param('pageNumber') pageNumber :number, @Param('noOfRows') noOfRows : number, @Req() req : CustomRequest){
    try{
      return this.usersService.findAll(req, +pageNumber, +noOfRows)
    }
    catch(err){
      throw err
    }
  }

  @Put(':id')
  async update(@Param('id') id : string, @Body() updateUserDto : UpdateUserDto, @Res() res : Response){
    try{
      const user = await this.usersService.update(id, updateUserDto)
      return res.status(200).json({
        status : true,
        message : "User updated successfully.",
        user
      })
    }
    catch(err){
      throw err
    } 
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: CustomRequest, @Res() res: Response) {
    const isUser = await this.usersService.findOne(id);

    if (req.role === ADMIN) {
      try{
        const user = await this.usersService.remove(id);
        return res.status(200).json({
          status : true,
          message : "User deleted successfully.",
          user
        })
      }
      catch (err){
        throw err
      }
    }

    if (req.role === MANAGER && [TEAM_LEADER, EMPLOYEE].includes(isUser.role)) {
      try{
        const user = await this.usersService.remove(id);
        return res.status(200).json({
          status : true,
          message : "User deleted successfully.",
          user
        })
      }
      catch(err){
        throw err
      }
    }

    if (req.role === TEAM_LEADER && isUser.role === EMPLOYEE) {
      try{
        const user = await this.usersService.remove(id);
        return res.status(200).json({
          status : true,
          message : "User deleted successfully.",
          user
        })
      }
      catch(err){
        throw err
      }
    }

    throw new UnauthorizedException("You are not authorized to delete any user.");
  }

  @Get('search/:query/:pageNumber/:noOfRows')
  async searchUser(@Param('query') query : string, @Param('pageNumber') pageNumber: number, @Param('noOfRows') noOfRows : number ,@Req() req : CustomRequest,  @Res() res : Response){
    const result = await this.usersService.searchUser(query, req, +pageNumber, +noOfRows)
    if(result.length <= 0) throw new NotFoundException(`User not found with ${query} search.`)
    return res.status(200).json({
      status : true, 
      message : "User found.",
      user : result
    })
  }
  @Get('getAllManager')
  async getAllManager(){
    return await this.usersService.getAllManager()
  }

  @Get('getAllTeamLeader')
  async getAllTeamLeader() {
    return await this.usersService.getAllTeamLeader()
  }
}
