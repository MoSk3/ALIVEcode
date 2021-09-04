import { Test, TestingModule } from '@nestjs/testing';
import { IoTObjectController } from './IoTobject.controller';
import { IoTObjectService } from './IoTobject.service';

describe('IoTobjectController', () => {
  let controller: IoTObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IoTObjectController],
      providers: [IoTObjectService],
    }).compile();

    controller = module.get<IoTObjectController>(IoTObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
