import { Column, ChildEntity, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Optional } from '@nestjs/common';

@ChildEntity()
export class Student extends User {
  @Column()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @Optional()
  @ManyToMany(() => Classroom, classroom => classroom.students)
  classrooms: any;
}
