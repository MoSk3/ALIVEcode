import { Module } from '@nestjs/common';
import { IoTGateway } from './iot.gateway';
import { IoTObjectService } from '../../models/iot/IoTobject/IoTobject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTObjectEntity } from '../../models/iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../models/iot/IoTproject/entities/IoTproject.entity';
import { IoTRouteEntity } from '../../models/iot/IoTroute/entities/IoTroute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IoTObjectEntity, IoTProjectEntity, IoTRouteEntity])],
  providers: [IoTObjectService, IoTGateway],
})
export class IoTModule {}