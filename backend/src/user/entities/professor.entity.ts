import { ChildEntity, Column, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

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

  @IsOptional()
  @OneToMany(() => ClassroomEntity, classroom => classroom.creator, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  classrooms: ClassroomEntity[];
}
