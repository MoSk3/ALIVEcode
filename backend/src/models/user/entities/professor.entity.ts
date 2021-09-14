import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { ClassroomEntity } from 'src/models/classroom/entities/classroom.entity';
import { CourseEntity } from 'src/models/course/entities/course.entity';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@ChildEntity()
export class ProfessorEntity extends UserEntity {
  @Column()
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/^[A-Za-z]*$/, { message: 'form.firstName.error.match' })
  firstName: string;

  @Column()
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/^[A-Za-z]*$/, { message: 'form.lastName.error.match' })
  lastName: string;

  @Exclude({ toClassOnly: true })
  @OneToMany(() => ClassroomEntity, classroom => classroom.creator, { cascade: true })
  classrooms: ClassroomEntity[];

  @Exclude({ toClassOnly: true })
  @OneToMany(() => CourseEntity, course => course.creator, { cascade: true })
  courses: CourseEntity[];
}
