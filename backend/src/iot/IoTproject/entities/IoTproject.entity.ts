import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { IotRouteEntity } from '../../IoTroute/entities/IoTroute.entity';

export enum IOTPROJECT_INTERACT_RIGHTS {
  ANYONE = 'AN',
  COLLABORATORS = 'CO',
  PRIVATE = 'PR',
}

export enum IOTPROJECT_ACCESS {
  PUBLIC = 'PU', // can be found via a search
  UNLISTED = 'UN', // must be shared via a url
  RESTRICTED = 'RE', // limited to certain classes
  PRIVATE = 'PR', // only accessible to the creator
}

@Entity()
export class IoTProjectEntity extends CreatedByUser {
  @ManyToOne(() => UserEntity, user => user.IoTProjects, { eager: true })
  creator: UserEntity;

  // TODO : body typing
  @Column()
  body: string;

  @Column({ enum: IOTPROJECT_ACCESS })
  access: IOTPROJECT_ACCESS;

  @Column({ enum: IOTPROJECT_INTERACT_RIGHTS })
  interactRights: IOTPROJECT_INTERACT_RIGHTS;

  @ManyToMany(() => UserEntity, user => user.collabIoTProjects)
  @JoinColumn()
  collaborators: UserEntity[];

  @OneToMany(() => IotRouteEntity, route => route.project)
  routes: IotRouteEntity[];
}
