import { Module } from '@nestjs/common';
import { SendotpService } from './sendotp.service';
import { SendotpController } from './sendotp.controller';
import { mailservice } from './mailservice.service';

@Module({
  controllers: [SendotpController],
  providers: [SendotpService, mailservice],
})
export class SendotpModule {}
