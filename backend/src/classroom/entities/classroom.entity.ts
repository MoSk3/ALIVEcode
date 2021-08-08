import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ProfessorEntity } from '../../user/entities/professor.entity';
import { StudentEntity } from '../../user/entities/student.entity';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';

@Entity()
export class Classroom extends CreatedByUser {
  @ManyToOne(() => ProfessorEntity, professor => professor.classrooms)
  creator: ProfessorEntity;

  @ManyToOne(() => ProfessorEntity, professor => professor.classrooms)
  professor: ProfessorEntity;

  @ManyToMany(() => StudentEntity, student => student.classrooms)
  @JoinTable()
  students: StudentEntity[];
}
