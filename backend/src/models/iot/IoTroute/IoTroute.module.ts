import { Module } from '@nestjs/common';
import { IoTRouteService } from './IoTroute.service';
import { IoTRouteController } from './IoTroute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotRouteEntity } from './entities/IoTroute.entity';
import { IoTProjectEntity } from '../IoTproject/entities/IoTproject.entity';
import { IoTProjectService } from '../IoTproject/IoTproject.service';
import { UserEntity } from '../../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotRouteEntity, IoTProjectEntity, UserEntity])],
  controllers: [IoTRouteController],
  providers: [IoTRouteService, IoTProjectService],
})
export class IoTRouteModule {}
