import { ChildEntity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { IsNotEmpty, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { CourseEntity } from '../../course/entities/course.entity';

@ChildEntity()
export class ProfessorEntity extends UserEntity {
  @Column()
  @IsNotEmpty()
  @Length(3, 25)
  firstName: string;

  @Column()
  @IsNotEmpty()
  @Length(3, 25)
  lastName: string;

  @Exclude({ toClassOnly: true })
  @OneToMany(() => ClassroomEntity, classroom => classroom.creator, { cascade: true })
  classrooms: ClassroomEntity[];

  @Exclude({ toClassOnly: true })
  @OneToMany(() => CourseEntity, course => course.creator, { cascade: true })
  courses: CourseEntity[];
}
