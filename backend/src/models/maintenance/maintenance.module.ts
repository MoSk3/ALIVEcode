import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { MaintenanceEntity } from './entities/maintenance.entity';
import { DefaultAdminSite } from 'nestjs-admin';
import { MaintenanceAdmin } from './entities/maintenance.admin';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceEntity, UserEntity]), AdminModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('Maintenance', MaintenanceAdmin);
  }
}
