import { Test, TestingModule } from '@nestjs/testing';
import { IoTRouteController } from './IoTroute.controller';
import { IoTRouteService } from './IoTroute.service';

describe('IoTprojectController', () => {
  let controller: IoTRouteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IoTRouteController],
      providers: [IoTRouteService],
    }).compile();

    controller = module.get<IoTRouteController>(IoTRouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
