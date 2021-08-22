import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { IoTProjectEntity } from 'src/models/iot/IoTproject/entities/IoTproject.entity';

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
