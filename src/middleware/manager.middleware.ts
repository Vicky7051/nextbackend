import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ADMIN, EMPLOYEE, MANAGER, TEAM_LEADER } from "src/Constant/Constant";
import { UsersService } from "src/users/users.service";

export class managerMiddleware implements NestMiddleware {
    constructor(
        private readonly userService : UsersService
    ){}
    use(req: any, res: any, next: (error?: Error | any) => void) {
        if(req.role === ADMIN) return next()
        if(![TEAM_LEADER, EMPLOYEE].includes(req.body.role)){
            throw new UnauthorizedException(`You are not authorize to create ${req.body.role}`)
        }
        next()
    }
}