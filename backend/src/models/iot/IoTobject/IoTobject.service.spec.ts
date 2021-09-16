import { Test, TestingModule } from '@nestjs/testing';
import { IoTObjectService } from './IoTobject.service';
import { IoTObjectController } from './IoTobject.controller';

describe('IoTObjectService', () => {
  let service: IoTObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IoTObjectService],
    }).compile();

    service = module.get<IoTObjectService>(IoTObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
