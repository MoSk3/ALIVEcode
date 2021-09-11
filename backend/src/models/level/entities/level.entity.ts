import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreatedByUser } from 'src/generics/entities/createdByUser.entity';
import { Entity, ManyToOne, Column, TableInheritance } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export enum LEVEL_TAG {}
export enum LEVEL_ACCESS {
  PUBLIC = 'PU', // can be found via a search
  UNLISTED = 'UN', // must be shared via a url
  RESTRICTED = 'RE', // limited to certain classes
  PRIVATE = 'PR', // only accessible to the creator
}

export enum LEVEL_DIFFICULTY {
  BEGINNER = 'BE',
  EASY = 'EA',
  MEDIUM = 'ME',
  ADVANCED = 'AD',
  HARD = 'HA',
  EXPERT = 'EX',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class LevelEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => UserEntity, user => user.levels, { eager: true })
  creator: UserEntity;

  @Column({ enum: LEVEL_ACCESS })
  @IsNotEmpty()
  access: LEVEL_ACCESS;

  @Column({ enum: LEVEL_DIFFICULTY })
  @IsNotEmpty()
  difficulty: LEVEL_DIFFICULTY;

  @Column({ type: 'jsonb', default: () => "'[]'", nullable: false })
  @IsOptional()
  hints: string[] = [];

  @Column({ enum: LEVEL_TAG, type: 'jsonb', default: () => "'[]'" })
  @IsOptional()
  tags: LEVEL_TAG[] = [];
}
