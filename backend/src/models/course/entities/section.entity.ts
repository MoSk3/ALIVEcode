import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
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
  activities: ActivityEntity[];

  @ManyToOne(() => CourseEntity, course => course.sections, { onDelete: 'CASCADE' })
  course: CourseEntity;
}