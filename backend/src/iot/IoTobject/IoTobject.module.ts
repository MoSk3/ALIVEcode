import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTObjectEntity } from './entities/IoTobject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTObjectController } from './IoTobject.controller';
import { IoTObjectService } from './IoTobject.service';

@Module({
  imports: [TypeOrmModule.forFeature([IoTObjectEntity, UserEntity])],
  controllers: [IoTObjectController],
  providers: [IoTObjectService],
})
export class IoTObjectModule {}
