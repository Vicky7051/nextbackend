import { Injectable } from '@nestjs/common';
import { getClientIpAndLocation, getClientIp } from 'client-ip-geolocation'
import { Request } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getIpAddress(request: Request) : Promise<any> {
    const data = await getClientIpAndLocation(request)
    const ip = await getClientIp(request)
    console.log("called")
    const res = {
      status : true,
      message : "IP Address fetched successfully.",
      data : {
        data, ip
      }
    }
    return res
  }
}
