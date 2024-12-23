import { Test, TestingModule } from '@nestjs/testing';
import { SendotpService } from './sendotp.service';

describe('SendotpService', () => {
  let service: SendotpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendotpService],
    }).compile();

    service = module.get<SendotpService>(SendotpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
