import { Test, TestingModule } from '@nestjs/testing';
import { IoTProjectService } from './IoTproject.service';

describe('IoTprojectService', () => {
  let service: IoTProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IoTProjectService],
    }).compile();

    service = module.get<IoTProjectService>(IoTProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
