import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { CustomRequest } from 'src/Interfaces/CustomRequest';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async loginUser(@Body() createAuthDto : CreateAuthDto,@Res({passthrough : true}) res : Response) : Promise<any> {
    return this.authService.loginUser(createAuthDto, res)
  }

  @Get('autoLogin')
  async autoLogin(@Req() req : CustomRequest, @Res() res : Response){
    return this.authService.autoLogin(req, res)
  }

  @Post('logout')
  async logoutUser(@Res() res : Response){
    return this.authService.logoutUser(res)
  }
}
