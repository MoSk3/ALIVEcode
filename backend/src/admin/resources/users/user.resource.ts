import { ResourceWithOptions } from 'adminjs';
import { UserEntity } from '../../../models/user/entities/user.entity';
import { UserParent } from './users.parent';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: { parent: UserParent },
};

export default UserResource;