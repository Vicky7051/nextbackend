import { Test, TestingModule } from '@nestjs/testing';
import { SendotpController } from './sendotp.controller';
import { SendotpService } from './sendotp.service';

describe('SendotpController', () => {
  let controller: SendotpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendotpController],
      providers: [SendotpService],
    }).compile();

    controller = module.get<SendotpController>(SendotpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
