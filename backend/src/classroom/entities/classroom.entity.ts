import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ProfessorEntity } from '../../user/entities/professor.entity';
import { StudentEntity } from '../../user/entities/student.entity';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';

@Entity()
export class ClassroomEntity extends CreatedByUser {
  @ManyToOne(() => ProfessorEntity, professor => professor.classrooms, { eager: true, onDelete: 'CASCADE' })
  creator: ProfessorEntity;

  @ManyToMany(() => StudentEntity, student => student.classrooms)
  @JoinTable()
  students: StudentEntity[];
}
