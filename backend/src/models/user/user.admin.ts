import { AdminEntity } from "nestjs-admin";
import { UserEntity } from './entities/user.entity';

export class UserAdmin extends AdminEntity {
  entity = UserEntity;
  listDisplay = ['email', 'firstName', 'lastName', 'name'];
  searchFields = ['firstName', 'lastName', 'name'];
}