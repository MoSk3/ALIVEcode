import { LevelEntity } from "./level.entity";
import { Column, ChildEntity } from 'typeorm';
import { IsOptional } from 'class-validator';

@ChildEntity()
export class LevelIoTEntity extends LevelEntity {
  @Column({ nullable: true })
  @IsOptional()
  project?: string;
}
