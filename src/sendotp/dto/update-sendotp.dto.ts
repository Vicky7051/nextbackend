import { PartialType } from '@nestjs/mapped-types';
import { CreateSendotpDto } from './create-sendotp.dto';

export class UpdateSendotpDto extends PartialType(CreateSendotpDto) {}
