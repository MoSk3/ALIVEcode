import { Module } from '@nestjs/common';
import { IoTProjectService } from './IoTproject.service';
import { IoTProjectController } from './IoTproject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from './entities/IoTproject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IoTProjectEntity, IoTRouteEntity, IoTObjectEntity, UserEntity])],
  controllers: [IoTProjectController],
  providers: [IoTProjectService, IoTObjectService],
})
export class IoTProjectModule {}
