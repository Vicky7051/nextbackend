import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as JWT from 'jsonwebtoken'

@Injectable()
export class checkRoleMiddleware implements NestMiddleware {
    constructor(
        private readonly userService : UsersService
    ){}
    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const token = req.cookies.authToken
        if(!token) throw new UnauthorizedException("Unauthorized access.")
        const payload = await JWT.verify(token, process.env.SECRET_KEY)
        const isUser = await this.userService.findOne(payload.userId)
        if(!isUser) throw new UnauthorizedException("Unauthorized access.")
        req.role = isUser.role
        req.id = isUser._id
        req.body.createBy = isUser._id
        next()
    }
}