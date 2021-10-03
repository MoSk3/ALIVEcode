import { Exclude, Type } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class ActivityContent {
  body: string;
}

@Entity()
export class ActivityEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'json', default: {} })
  @Type(() => ActivityContent)
  content: ActivityContent;
}