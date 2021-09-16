import { INestApplication, Injectable, NestMiddleware } from '@nestjs/common';
//import AdminBro from 'admin-bro';
//import * as AdminBroExpress from 'admin-bro-expressjs';
//import { Database, Resource } from '@admin-bro/typeorm';
//import UserResource from './resources/user.resource';
import { UserEntity } from '../models/user/entities/user.entity';
import { UserService } from '../models/user/user.service';
import { hasRole } from '../models/user/auth';
import { Role } from 'src/utils/types/roles.types';

/*
@Injectable()
export class AdminPanel implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(app: INestApplication) {
    console.log(app);
    AdminBro.registerAdapter({ Database, Resource });

    // Create adminBro instance
    const adminBro = new AdminBro({
      resources: [UserResource], // Here we will put resources
      rootPath: '/admin', // Define path for the admin panel
    });

    // Create router
    const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
      authenticate: async (email, password) => {
        const user = await this.userService.findByEmail(email);
        if (!user || !hasRole(user, Role.STAFF)) return false;
        return user;
      },
      cookiePassword: 'session Key',
    });

    // Bind routing
    app.use(adminBro.options.rootPath, router);
  }
}*/

/*export const setupAdminPanel = async (app: INestApplication): Promise<void> => {
  /** Register TypeORM adapter */
  //AdminBro.registerAdapter({ Database, Resource });

  /** Create adminBro instance */
  /*const adminBro = new AdminBro({
    resources: [UserResource], // Here we will put resources
    rootPath: '/admin', // Define path for the admin panel
  });
*/
  /** Create router */
  /*const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      return new UserEntity();

    },
    cookiePassword: 'session Key',
  });*/

  /** Bind routing */
  //app.use(adminBro.options.rootPath, router);
//};