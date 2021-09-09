import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export type LevelAliveProgressionData = {
  code?: string;
};

export type LevelAIProgressionData = {
  code?: string;
};

export type LevelCodeProgressionData = {
  code?: string;
};

export type LevelProgressionData = LevelAliveProgressionData | LevelCodeProgressionData | LevelAIProgressionData;

@Entity()
export class LevelProgressionEntity {
  @PrimaryGeneratedColumn()
  @IsEmpty()
  @Exclude()
  id: string;

  @Column({ nullable: false })
  @Exclude()
  levelId: string;

  @Column({ type: 'json', default: () => "'{}'" })
  @IsOptional()
  data: LevelProgressionData;

  @ManyToOne(() => UserEntity, user => user.levelProgressions)
  user: UserEntity;
}
