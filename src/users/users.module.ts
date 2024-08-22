import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { USERS_MODEL_NAME } from 'src/Constant/ConnectionName';
import { UserSchema } from './Schema/users.schema';
import { checkRoleMiddleware } from 'src/middleware/checkRole.middleware';
import { managerMiddleware } from 'src/middleware/manager.middleware';
import { teamLeaderMiddleware } from 'src/middleware/teamLeader.meddleware';
import { authorizationMiddleware } from 'src/middleware/authorization.middleware';
import { SalaryModule } from 'src/salary/salary.module';

@Module({
  imports : [MongooseModule.forFeature([{name : USERS_MODEL_NAME, schema : UserSchema}]), SalaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports : [UsersService]
})
export class UsersModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authorizationMiddleware).forRoutes(UsersController);

    consumer.apply(
      checkRoleMiddleware,
      managerMiddleware,
      teamLeaderMiddleware
    ).forRoutes(
      { path: 'users', method: RequestMethod.POST },
      { path: 'users/:id', method: RequestMethod.PUT },
    )
  }
}
