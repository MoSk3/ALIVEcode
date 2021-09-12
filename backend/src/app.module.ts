import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../ormconfig';
import { DefaultAdminModule } from 'nestjs-admin';
import { AsScriptModule } from './as-script/as-script.module';
import { ClassroomModule } from './models/classroom/classroom.module';
import { CourseModule } from './models/course/course.module';
import { IoTObjectModule } from './models/iot/IoTobject/IoTobject.module';
import { IoTProjectModule } from './models/iot/IoTproject/IoTproject.module';
import { IoTRouteModule } from './models/iot/IoTroute/IoTroute.module';
import { LevelModule } from './models/level/level.module';
import { UserModule } from './models/user/user.module';

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
