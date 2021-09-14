import { Test, TestingModule } from '@nestjs/testing';
import { AsScriptService } from './as-script.service';

describe('AsScriptService', () => {
  let service: AsScriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsScriptService],
    }).compile();

    service = module.get<AsScriptService>(AsScriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
