import { ResourceWithOptions } from 'adminjs';
import { ClassroomEntity } from '../../../models/classroom/entities/classroom.entity';
import { classroomParent } from './classroom.parent';

const ClassroomResource: ResourceWithOptions = {
  resource: ClassroomEntity,
  options: { parent: classroomParent },
};

export default ClassroomResource;