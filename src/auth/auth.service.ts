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

    res.cookie('authToken', token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: true, // Ensures cookies are sent over HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day in milliseconds)
      sameSite: 'none', // CSRF protection
    });
    res.cookie('role', isUser.role, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: true, // Ensures cookies are sent over HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day in milliseconds)
      sameSite: 'none', // CSRF protection
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
    res.clearCookie('authToken', {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS only in production
      sameSite: 'none', // CSRF protection
    })

    res.status(200).json({
      status : true,
      message : "User logout successfully."
    })
  }
}
