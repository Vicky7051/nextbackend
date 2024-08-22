import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as JWT from 'jsonwebtoken'
import { Response } from "express";
import { CustomRequest } from "src/Interfaces/CustomRequest";

@Injectable()
export class authorizationMiddleware implements NestMiddleware {
    constructor(
        private readonly userService : UsersService
    ){}
    async use(req: any, res: Response, next: (error?: Error | any) => void) {
        try{
            const token = req.cookies.authToken
            if(!token) throw new UnauthorizedException("Unauthorized access.")
            const payload = await JWT.verify(token, process.env.SECRET_KEY)
            const isUser = await this.userService.findOne(payload.userId)
            if(!isUser) throw new UnauthorizedException("Unauthorized access.")
            req.role = isUser.role
            req.id = isUser._id
            next()
        }
        catch(err){
            res.clearCookie('authToken', {
                httpOnly: true,
                secure: true,   
                sameSite: 'none' 
              });
              res.clearCookie('role', {
                httpOnly: true,
                secure: true,   
                sameSite: 'none' 
              })
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid Signature. Please login again"
            })
        }
    }
}