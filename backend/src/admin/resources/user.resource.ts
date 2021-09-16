import { ResourceWithOptions } from 'adminjs';
import { UserEntity } from '../../models/user/entities/user.entity';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {},
};

export default UserResource;