import { AdminEntity } from 'nestjs-admin';
import { MaintenanceEntity } from './maintenance.entity';

export class MaintenanceAdmin extends AdminEntity {
  entity = MaintenanceEntity;
  listDisplay = ['startDate', 'finishDate'];
}