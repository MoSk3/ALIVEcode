import { Column, Entity, ManyToOne } from "typeorm";
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';

export enum IoTObjectLabel {
  HOME,
  OTHER,
}

@Entity()
export class IoTObjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTObjects, { eager: true })
  creator: UserEntity;

  @Column({ enum: IoTObjectLabel })
  label: IoTObjectLabel;
}
