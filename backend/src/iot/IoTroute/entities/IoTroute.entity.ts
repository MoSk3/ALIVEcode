import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { IoTProjectEntity } from 'src/iot/IoTproject/entities/IoTproject.entity';

@Entity()
export class IotRouteEntity {
  @PrimaryGeneratedColumn()
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(3, 25)
  name: string;
  
  @ManyToOne(() => IoTProjectEntity, project => project.routes)
  project: IoTProjectEntity;
}
