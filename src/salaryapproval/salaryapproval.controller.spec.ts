import { Test, TestingModule } from '@nestjs/testing';
import { SalaryapprovalController } from './salaryapproval.controller';
import { SalaryapprovalService } from './salaryapproval.service';

describe('SalaryapprovalController', () => {
  let controller: SalaryapprovalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryapprovalController],
      providers: [SalaryapprovalService],
    }).compile();

    controller = module.get<SalaryapprovalController>(SalaryapprovalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
