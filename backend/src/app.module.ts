import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../ormconfig';
import { AsScriptModule } from './as-script/as-script.module';
import { ClassroomModule } from './models/classroom/classroom.module';
import { CourseModule } from './models/course/course.module';
import { IoTObjectModule } from './models/iot/IoTobject/IoTobject.module';
import { IoTProjectModule } from './models/iot/IoTproject/IoTproject.module';
import { IoTRouteModule } from './models/iot/IoTroute/IoTroute.module';
import { LevelModule } from './models/level/level.module';
import { IoTGateway } from './socket/iotSocket/iot.gateway';
import { AdminModule } from './models/admin/admin.module';
import { MaintenanceModule } from './models/maintenance/maintenance.module';
import { MaintenanceMiddleware } from './utils/middlewares/maintenance.middleware';
import { MaintenanceEntity } from './models/maintenance/entities/maintenance.entity';
import { AuthMiddleware } from './utils/middlewares/auth.middleware';
import { MaintenanceService } from './models/maintenance/maintenance.service';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceEntity]),
    TypeOrmModule.forRoot(config),
    UserModule,
    ClassroomModule,
    LevelModule,
    CourseModule,
    IoTObjectModule,
    IoTProjectModule,
    IoTRouteModule,
    IoTGateway,
    AdminModule,
    MaintenanceModule,
    AsScriptModule,
  ],
  controllers: [AppController],
  providers: [AppService, MaintenanceService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(MaintenanceMiddleware)
      .exclude(
        { path: '/users/login', method: RequestMethod.POST },
        { path: '/users/refreshToken', method: RequestMethod.POST },
        'maintenances/(.*)',
        'maintenances',
        'admin/(.*)',
        'admin',
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
