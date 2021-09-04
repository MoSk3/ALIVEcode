import { Exclude } from 'class-transformer';
import { CreatedByUser } from 'src/generics/entities/createdByUser.entity';
import { Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class LevelEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => UserEntity, user => user.levels)
  creator: UserEntity;
}
