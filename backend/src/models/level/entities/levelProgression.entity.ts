import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export type LevelProgression = {
  code?: string;
};

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
  data: LevelProgression;

  @ManyToOne(() => UserEntity, user => user.levelProgressions)
  user: UserEntity;
}
