import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@ChildEntity()
export class Professor extends User {
  @Column()
  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(25)
  lastName: string;

  @IsOptional()
  @OneToMany(() => Classroom, classroom => classroom.professor)
  classrooms: Classroom[];
}
