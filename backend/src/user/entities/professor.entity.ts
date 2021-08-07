import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';

@ChildEntity()
export class Professor extends User {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Classroom, classroom => classroom.creator)
  classrooms: Classroom;
}
