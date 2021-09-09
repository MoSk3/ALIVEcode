import { Column, ChildEntity, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { IsNotEmpty, Length } from 'class-validator';
import { Optional } from '@nestjs/common';
import { GetterDefault } from '../../../utils/decorators/getterDefault.decorators';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';

@ChildEntity()
export class StudentEntity extends UserEntity {
  @Column()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @Optional()
  @ManyToMany(() => ClassroomEntity, classroom => classroom.students)
  @GetterDefault({ defaultValue: [] })
  classrooms: ClassroomEntity[];
}
