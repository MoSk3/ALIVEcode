import { LevelEntity } from "./level.entity";
import { Column, ChildEntity } from 'typeorm';
import { IsOptional, IsEmpty } from 'class-validator';

@ChildEntity()
export class LevelAIEntity extends LevelEntity {
  @Column({ nullable: true })
  @IsOptional()
  initialCode?: string;

  @Column({ nullable: true })
  @IsOptional()
  solution?: string;

  @Column({ nullable: true, default: 'ai' })
  @IsEmpty()
  ai: string;
}
