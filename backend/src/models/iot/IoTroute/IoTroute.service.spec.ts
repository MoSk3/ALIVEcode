import { Test, TestingModule } from '@nestjs/testing';
import { IoTRouteService } from './IoTroute.service';

describe('IoTprojectService', () => {
  let service: IoTRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IoTRouteService],
    }).compile();

    service = module.get<IoTRouteService>(IoTRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
