import { Injectable } from '@nestjs/common';
import { CreateSendotpDto } from './dto/create-sendotp.dto';
import { UpdateSendotpDto } from './dto/update-sendotp.dto';

@Injectable()
export class SendotpService {
  create(createSendotpDto: CreateSendotpDto) {
    return 'This action adds a new sendotp';
  }

  findAll() {
    return `This action returns all sendotp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sendotp`;
  }

  update(id: number, updateSendotpDto: UpdateSendotpDto) {
    return `This action updates a #${id} sendotp`;
  }

  remove(id: number) {
    return `This action removes a #${id} sendotp`;
  }
}
