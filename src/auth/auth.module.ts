import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { authorizationMiddleware } from 'src/middleware/authorization.middleware';

@Module({
  imports : [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authorizationMiddleware)
    .forRoutes(
      { path: 'auth/autoLogin', method: RequestMethod.GET}
    )
  }
}
