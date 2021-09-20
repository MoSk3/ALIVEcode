import { ResourceWithOptions } from 'adminjs';
import { iotParent } from './iot.parent';
import { IoTObjectEntity } from '../../../models/iot/IoTobject/entities/IoTobject.entity';

const IoTObjectResource: ResourceWithOptions = {
  resource: IoTObjectEntity,
  options: { parent: iotParent },
};

export default IoTObjectResource;