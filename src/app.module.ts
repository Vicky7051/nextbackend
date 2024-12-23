import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SalaryModule } from './salary/salary.module';
import { SalaryapprovalModule } from './salaryapproval/salaryapproval.module';
import { SendotpModule } from './sendotp/sendotp.module';
import * as cookieParser from 'cookie-parser';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './response/response.interceptor.spec';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SalaryModule,
    SalaryapprovalModule,
    SendotpModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR, // This applies the interceptor globally
      useClass: ResponseInterceptor,
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*')
  }
}
