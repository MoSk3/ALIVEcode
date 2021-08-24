import { Module } from '@nestjs/common';
import { IoTProjectService } from './IoTproject.service';
import { IoTProjectController } from './IoTproject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from './entities/IoTproject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IotRouteEntity } from '../IoTroute/entities/IoTroute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IoTProjectEntity, IotRouteEntity, UserEntity])],
  controllers: [IoTProjectController],
  providers: [IoTProjectService],
})
export class IoTProjectModule {}
