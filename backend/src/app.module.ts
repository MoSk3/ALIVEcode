import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
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
import { MaintenanceModule } from './models/maintenance/maintenance.module';
import { MaintenanceMiddleware } from './utils/middlewares/maintenance.middleware';
import { MaintenanceEntity } from './models/maintenance/entities/maintenance.entity';
import { AuthMiddleware } from './utils/middlewares/auth.middleware';
import { MaintenanceService } from './models/maintenance/maintenance.service';
import { UserModule } from './models/user/user.module';
import { UserService } from './models/user/user.service';
import { AdminModule } from '@adminjs/nestjs';
import adminjs from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import { UserEntity } from './models/user/entities/user.entity';
import { Repository } from 'typeorm';
import { hasRole } from './models/user/auth';
import { Role } from './utils/types/roles.types';
import UserResource from './admin/resources/user.resource';
import { compare } from 'bcryptjs';

adminjs.registerAdapter({ Database, Resource });

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceEntity]),
    TypeOrmModule.forRoot(config),
    AdminModule.createAdminAsync({
      imports: [UserModule],
      inject: [getRepositoryToken(UserEntity)],
      useFactory: (userRepo: Repository<UserEntity>) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [UserResource],
        },
        auth: {
          authenticate: async (email, password) => {
            const user = await userRepo.findOne({ where: { email } });
            if (!user || !hasRole(user, Role.STAFF) || !(await compare(password, user.password))) return null;
            return user;
          },
          cookiePassword: process.env.ADMIN_COOKIE_PASS,
          cookieName: process.env.ADMIN_COOKIE_NAME,
        },
      }),
    }),
    UserModule,
    ClassroomModule,
    LevelModule,
    CourseModule,
    IoTObjectModule,
    IoTProjectModule,
    IoTRouteModule,
    IoTGateway,
    MaintenanceModule,
    AsScriptModule,
  ],
  controllers: [AppController],
  providers: [AppService, MaintenanceService, UserService],
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
