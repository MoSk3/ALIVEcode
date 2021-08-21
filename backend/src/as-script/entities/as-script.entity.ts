import { UserEntity } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';

@Entity()
export class AsScriptEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.asScripts, { eager: true, onDelete: 'CASCADE' })
  creator: UserEntity;
}
