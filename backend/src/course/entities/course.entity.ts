import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ManyToOne } from 'typeorm';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';
import { ProfessorEntity } from '../../user/entities/professor.entity';

export class CourseEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @IsNotEmpty()
  @ManyToOne(() => ProfessorEntity, professor => professor.courses)
  creator: ProfessorEntity;
}
