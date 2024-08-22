import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ADMIN, EMPLOYEE, MANAGER } from "src/Constant/Constant";

export class teamLeaderMiddleware implements NestMiddleware{
    use(req: any, res: any, next: (error?: Error | any) => void) {
        if([ADMIN, MANAGER].includes(req.role)) return next()
        if(req.role === EMPLOYEE){
            throw new UnauthorizedException("You are not authorize to create any user.")
        }
        if(req.body.role !== EMPLOYEE){
            throw new UnauthorizedException(`You are not authorize to create ${req.body.role}`)
        }
        next()
    }
}