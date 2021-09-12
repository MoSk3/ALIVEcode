import { Entity, JoinTable, ManyToMany, ManyToOne, Column } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { CourseEntity } from '../../course/entities/course.entity';
import { StudentEntity } from '../../user/entities/student.entity';
import { ProfessorEntity } from '../../user/entities/professor.entity';

export enum CLASSROOM_SUBJECT {
  INFORMATIC = 'IN',
  AI = 'AI',
  MATH = 'MA',
  SCIENCE = 'SC',
}

@Entity()
export class ClassroomEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => ProfessorEntity, professor => professor.classrooms, { eager: true, onDelete: 'CASCADE' })
  creator: ProfessorEntity;

  @IsEmpty()
  @Column({ length: 6, unique: true, nullable: false })
  // TODO : maybe hide the code
  // The code consists of letters from a-z and numbers from 0-9 | case non-senstive
  code: string;

  @IsNotEmpty()
  @Column({ enum: CLASSROOM_SUBJECT, nullable: false })
  subject: CLASSROOM_SUBJECT;

  @Exclude({ toClassOnly: true })
  @ManyToMany(() => StudentEntity, student => student.classrooms)
  @JoinTable()
  students: StudentEntity[];

  @Exclude({ toClassOnly: true })
  @ManyToMany(() => CourseEntity, course => course.classrooms)
  @JoinTable()
  courses: CourseEntity[];
}
