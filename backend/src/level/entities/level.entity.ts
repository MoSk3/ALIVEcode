import { Entity, ManyToOne } from 'typeorm';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class LevelEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.levels)
  creator: UserEntity;
}
