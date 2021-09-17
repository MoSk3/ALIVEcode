import { ResourceWithOptions } from 'adminjs';
import { ProfessorEntity } from '../../../models/user/entities/professor.entity';
import { UserParent } from './users.parent';

const ProfessorResource: ResourceWithOptions = {
  resource: ProfessorEntity,
  options: { parent: UserParent },
};

export default ProfessorResource;