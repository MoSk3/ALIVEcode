import { ResourceWithOptions } from 'adminjs';
import { iotParent } from './iot.parent';
import { IoTProjectEntity } from '../../../models/iot/IoTproject/entities/IoTproject.entity';

const IoTProjectResource: ResourceWithOptions = {
  resource: IoTProjectEntity,
  options: { parent: iotParent },
};

export default IoTProjectResource;