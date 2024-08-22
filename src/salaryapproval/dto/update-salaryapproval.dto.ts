import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryapprovalDto } from './create-salaryapproval.dto';

export class UpdateSalaryapprovalDto extends PartialType(CreateSalaryapprovalDto) {}
