import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { IoTProjectEntity } from '../../IoTproject/entities/IoTproject.entity';

@Entity()
export class IoTRouteEntity {
  @PrimaryGeneratedColumn()
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(2, 50)
  path: string;

  @ManyToOne(() => IoTProjectEntity, project => project.routes, { onDelete: 'CASCADE' })
  project: IoTProjectEntity;
}
