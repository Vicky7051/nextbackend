import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SALARYS_NAME } from 'src/Constant/ConnectionName';
import { Model } from 'mongoose';
import { SalarySchema } from './Schema/salary.schema';

@Module({
  imports : [MongooseModule.forFeature([{name : SALARYS_NAME, schema : SalarySchema}])],
  controllers: [SalaryController],
  providers: [SalaryService],
  exports : [SalaryService]
})
export class SalaryModule {}
