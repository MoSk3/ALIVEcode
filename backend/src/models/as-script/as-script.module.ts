import { Module } from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { AsScriptController } from './as-script.controller';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTRouteEntity } from '../iot/IoTroute/entities/IoTroute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IoTProjectEntity, IoTRouteEntity])],
  controllers: [AsScriptController],
  providers: [AsScriptService, IoTProjectService],
})
export class AsScriptModule {}
