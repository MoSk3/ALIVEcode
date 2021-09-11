import { LevelEntity } from "./level.entity";
import { Column, ChildEntity } from 'typeorm';
import { IsOptional } from 'class-validator';

export enum LEVEL_RESOLUTION_MODE {
  ANY = 'ANY',
}

@ChildEntity()
export class LevelAliveEntity extends LevelEntity {
  @Column({ type: 'json', default: () => "'{}'" })
  @IsOptional()
  layout: string;

  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ enum: LEVEL_RESOLUTION_MODE, default: LEVEL_RESOLUTION_MODE.ANY })
  @IsOptional()
  resolution: LEVEL_RESOLUTION_MODE;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;
}
