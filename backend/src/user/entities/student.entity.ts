import { Column, ChildEntity, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';

@ChildEntity()
export class Student extends User {
  @Column()
  name: string;

  @ManyToMany(() => Classroom, classroom => classroom.students)
  classrooms: any;
}
