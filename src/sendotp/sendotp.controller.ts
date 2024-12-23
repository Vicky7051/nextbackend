import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendotpService } from './sendotp.service';
import { CreateSendotpDto } from './dto/create-sendotp.dto';
import { UpdateSendotpDto } from './dto/update-sendotp.dto';
import { mailservice } from './mailservice.service';

@Controller('sendotp')
export class SendotpController {
  constructor(
    private readonly sendotpService: SendotpService,
    private readonly mailService : mailservice
  ) {}

  @Post()
  async create(@Body() createSendotpDto: CreateSendotpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailService.sendOtp("vicky.kumar@xcelore.com", otp)
    return this.sendotpService.create(createSendotpDto);
  }

  @Get()
  findAll() {
    return this.sendotpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendotpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSendotpDto: UpdateSendotpDto) {
    return this.sendotpService.update(+id, updateSendotpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendotpService.remove(+id);
  }
}
