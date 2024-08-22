import { Test, TestingModule } from '@nestjs/testing';
import { SalaryapprovalService } from './salaryapproval.service';

describe('SalaryapprovalService', () => {
  let service: SalaryapprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalaryapprovalService],
    }).compile();

    service = module.get<SalaryapprovalService>(SalaryapprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
