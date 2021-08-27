import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../ormconfig';
import { DefaultAdminModule } from 'nestjs-admin';
import { ClassroomModule } from './classroom/classroom.module';
import { LevelModule } from './level/level.module';
import { CourseModule } from './course/course.module';
import { IoTObjectModule } from './iot/IoTobject/IoTobject.module';
import { IoTProjectModule } from './iot/IoTproject/IoTproject.module';
import { IoTRouteModule } from './iot/IoTroute/IoTroute.module';
import { AsScriptModule } from './as-script/as-script.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    DefaultAdminModule,
    ClassroomModule,
    LevelModule,
    CourseModule,
    IoTObjectModule,
    IoTProjectModule,
    IoTRouteModule,
    AsScriptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
