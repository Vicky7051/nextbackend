import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SalaryapprovalService } from './salaryapproval.service';
import { SalaryapprovalController } from './salaryapproval.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SALARYS_APPROVAL_NAME } from 'src/Constant/ConnectionName';
import { SalaryApprovalSchame } from './schema/SalaryApproval.schema';
import { authorizationMiddleware } from 'src/middleware/authorization.middleware';
import { UsersModule } from 'src/users/users.module';
import { SalaryService } from 'src/salary/salary.service';
import { SalaryModule } from 'src/salary/salary.module';

@Module({
  imports : [MongooseModule.forFeature([{name : SALARYS_APPROVAL_NAME, schema : SalaryApprovalSchame}]), UsersModule, SalaryModule],
  controllers: [SalaryapprovalController],
  providers: [SalaryapprovalService],
  exports : [SalaryapprovalService]
})

export class SalaryapprovalModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authorizationMiddleware).forRoutes(SalaryapprovalController)
  }
}
