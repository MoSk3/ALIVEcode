import { Exclude } from 'class-transformer';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';

@Entity()
export class LevelEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => UserEntity, user => user.levels)
  creator: UserEntity;

  @OneToOne(() => AsScriptEntity)
  @JoinColumn()
  code: AsScriptEntity;
}
