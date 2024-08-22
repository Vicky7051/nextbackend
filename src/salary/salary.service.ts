import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SALARYS_NAME } from 'src/Constant/ConnectionName';
import { Model } from 'mongoose';
import { Salary } from './Schema/salary.schema';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(SALARYS_NAME) private readonly salaryModel : Model<Salary>
  ){}
  async create(createSalaryDto: CreateSalaryDto): Promise<Salary> {
    try{
      const salary = await this.salaryModel.create(createSalaryDto)
      if(!salary) throw new BadRequestException("Salary not created.")
      return salary
    }
    catch(err){
      throw new InternalServerErrorException("Internal server error.")
    }
  }

  findAll() {
    return `This action returns all salary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salary`;
  }

  update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return `This action updates a #${id} salary`;
  }

  remove(id: number) {
    return `This action removes a #${id} salary`;
  }
}
