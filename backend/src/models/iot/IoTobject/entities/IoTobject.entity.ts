import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne } from 'typeorm';
import { CreatedByUser } from '../../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';

export enum IoTObjectLabel {
  HOME = 'HO',
  OTHER = 'OT',
}

@Entity()
export class IoTObjectEntity extends CreatedByUser {
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.IoTObjects, { eager: true, onDelete: 'CASCADE' })
  creator: UserEntity;

  @IsNotEmpty()
  @Column({ enum: IoTObjectLabel })
  label: IoTObjectLabel;
}
