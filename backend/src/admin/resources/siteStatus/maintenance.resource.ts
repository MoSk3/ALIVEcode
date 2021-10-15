import { ResourceWithOptions } from 'adminjs';
import { MaintenanceEntity } from '../../../models/maintenance/entities/maintenance.entity';
import { siteStatusParent } from './siteStatus.parent';

const MaintenanceResource: ResourceWithOptions = {
  resource: MaintenanceEntity,
  options: { parent: siteStatusParent },
};

export default MaintenanceResource;