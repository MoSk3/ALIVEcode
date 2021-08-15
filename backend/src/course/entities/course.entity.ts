import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CreatedByUser } from '../../generics/entities/createdByUser.entity';
import { ProfessorEntity } from '../../user/entities/professor.entity';
import { SectionEntity } from './section.entity';

export enum COURSE_DIFFICULTY {
  BEGINNER = 1,
  EASY = 2,
  MEDIUM = 3,
  ADVANCED = 4,
  HARD = 5,
  EXPERT = 6,
}

export enum COURSE_ACCESS {
  PUBLIC = 'PU', // can be found via a search
  UNLISTED = 'UN', // must be shared via a url
  RESTRICTED = 'RE', // limited to certain classes
  PRIVATE = 'PR', // only accessible to the creator
}

export enum COURSE_SUBJECT {
  INFORMATIC = 'IN',
  AI = 'AI',
  MATH = 'MA',
  SCIENCE = 'SC',
}

@Entity()
export class CourseEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @IsNotEmpty()
  @ManyToOne(() => ProfessorEntity, professor => professor.courses, { eager: true })
  creator: ProfessorEntity;

  @IsEmpty()
  @Column({ length: 6, unique: true, nullable: false })
  // The code consists of letters from a-z and numbers from 0-9 | case non-senstive
  code: string;

  @IsNotEmpty()
  @Column({ enum: COURSE_DIFFICULTY, nullable: false })
  difficulty: COURSE_DIFFICULTY;

  @IsNotEmpty()
  @Column({ enum: COURSE_ACCESS, nullable: false })
  access: COURSE_ACCESS;

  @IsNotEmpty()
  @Column({ enum: COURSE_SUBJECT, nullable: false })
  subject: COURSE_SUBJECT;

  @OneToMany(() => SectionEntity, section => section.course)
  sections: SectionEntity[];
}
