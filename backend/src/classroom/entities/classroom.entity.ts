import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Professor } from '../../user/entities/professor.entity';
import { Student } from '../../user/entities/student.entity';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Professor, professor => professor.classrooms)
  professor: Professor;

  @ManyToMany(() => Student, student => student.classrooms)
  @JoinTable()
  students: Student[];
}
