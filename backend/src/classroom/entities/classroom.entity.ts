import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ProfessorEntity } from '../../user/entities/professor.entity';
import { StudentEntity } from '../../user/entities/student.entity';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ClassroomEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => ProfessorEntity, professor => professor.classrooms, { eager: true, onDelete: 'CASCADE' })
  creator: ProfessorEntity;

  @Exclude({ toClassOnly: true })
  @ManyToMany(() => StudentEntity, student => student.classrooms)
  @JoinTable()
  students: StudentEntity[];
}
