import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CourseEntity } from './course.entity';
import { ActivityEntity } from './activity.entity';

@Entity()
export class SectionEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => ActivityEntity)
  @IsEmpty()
  activities?: ActivityEntity[];

  @ManyToOne(() => CourseEntity, course => course.sections, { onDelete: 'CASCADE' })
  @IsEmpty()
  course: CourseEntity;
}