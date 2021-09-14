import { Column, ChildEntity, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';

@ChildEntity()
export class StudentEntity extends UserEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]*$/, { message: 'form.name.error.match' })
  name: string;

  @Optional()
  @ManyToMany(() => ClassroomEntity, classroom => classroom.students)
  classrooms: ClassroomEntity[];
}
