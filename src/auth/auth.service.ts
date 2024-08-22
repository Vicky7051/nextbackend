import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import * as JWT from 'jsonwebtoken'
import { Response } from 'express';
import { CustomRequest } from 'src/Interfaces/CustomRequest';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService : UsersService,
  ){}

  async loginUser(createAuthDto : CreateAuthDto, res: Response) : Promise<any> {
    const isUser = await this.userService.findByEmail(createAuthDto.email)
    if(!isUser) throw new BadRequestException("Invalid credential.") 
    const isPassword = await bcrypt.compare(createAuthDto.password, isUser.password) 
    if(!isPassword) throw new BadRequestException("Invalid credential.")
    const payload = {
      userId : isUser._id
    }
    const token = JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });

    // Set token in cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      // secure: process.env.NODE_ENV === 'production', // Only use `secure` in production
    });
    res.cookie('role', isUser.role, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({status : true, message : "Login successfilly", user : isUser, token})
  }

  async autoLogin (req : CustomRequest, res : Response) {
    const token = req.cookies.authToken
    const payload = await JWT.verify(token, process.env.SECRET_KEY)
    const isUser = await this.userService.findOne(payload.userId)
    res.status(200).json({
      status : true,
      message : "Login successfully",
      user : isUser
    })
  }

  async logoutUser (res : Response){
    res.clearCookie('authToken', {httpOnly : true})

    res.status(200).json({
      status : true,
      message : "User logout successfully."
    })
  }
}
