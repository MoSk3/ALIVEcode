import { ResourceWithOptions } from 'adminjs';
import { StudentEntity } from '../../../models/user/entities/student.entity';
import { UserParent } from './users.parent';

const StudentResource: ResourceWithOptions = {
  resource: StudentEntity,
  options: { parent: UserParent },
};

export default StudentResource;