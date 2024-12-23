import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/ip')
  getIpOfClient(
    @Req() request: Request
  ) : Promise<any> {
    try{
      return this.appService.getIpAddress(request)
    }
    catch(error : any) {
      throw error
    }
  }
}
