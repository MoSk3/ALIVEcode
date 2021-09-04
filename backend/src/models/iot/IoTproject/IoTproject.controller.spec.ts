import { Test, TestingModule } from '@nestjs/testing';
import { IoTProjectController } from './IoTproject.controller';
import { IoTProjectService } from './IoTproject.service';

describe('IoTprojectController', () => {
  let controller: IoTProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IoTProjectController],
      providers: [IoTProjectService],
    }).compile();

    controller = module.get<IoTProjectController>(IoTProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
