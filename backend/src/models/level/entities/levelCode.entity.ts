import { ChildEntity, Column } from 'typeorm';
import { LevelEntity } from './level.entity';
import { IsOptional, IsNotEmpty } from 'class-validator';

export enum LEVEL_RESOLUTION_MODE {
  ANY = 'ANY',
}

@ChildEntity()
export class LevelCodeEntity extends LevelEntity {
  @Column({ enum: LEVEL_RESOLUTION_MODE, default: LEVEL_RESOLUTION_MODE.ANY })
  @IsOptional()
  resolution: LEVEL_RESOLUTION_MODE;

  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ type: 'jsonb', nullable: false })
  @IsNotEmpty()
  testCases: string;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;
}