import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import * as JWT from 'jsonwebtoken'
import { UsersService } from "src/users/users.service";

@Injectable()
export class isAdminMiddleware implements NestMiddleware{
    constructor(
        private readonly userService : UsersService
    ){}
    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const token = req.cookies.authToken
        if(!token) throw new UnauthorizedException("Unauthorized access.")
        const payload = await JWT.verify(token, process.env.SECRET_KEY)
        const isUser = await this.userService.findOne(payload.userId)
        if(!isUser || isUser.role !== "ADMIN") throw new UnauthorizedException("Unauthorized access.")
        next()
    }
}