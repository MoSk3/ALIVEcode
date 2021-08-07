import { Column, Entity, Generated, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Professor } from '../../user/entities/professor.entity';
import { Student } from '../../user/entities/student.entity';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';

@Entity()
export class Classroom extends CreatedByUser {
  @ManyToOne(() => Professor, professor => professor.classrooms)
  creator: Professor;

  @Generated('uuid')
  @Column()
  code: string;

  @ManyToMany(() => Student, student => student.classrooms)
  @JoinTable()
  students: Student[];
}
