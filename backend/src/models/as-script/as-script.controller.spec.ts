import { Test, TestingModule } from '@nestjs/testing';
import { AsScriptController } from './as-script.controller';
import { AsScriptService } from './as-script.service';

describe('AsScriptController', () => {
  let controller: AsScriptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsScriptController],
      providers: [AsScriptService],
    }).compile();

    controller = module.get<AsScriptController>(AsScriptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
