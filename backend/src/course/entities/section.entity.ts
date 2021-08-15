import { IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity()
export class SectionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => CourseEntity, course => course.sections)
  course: CourseEntity;
}