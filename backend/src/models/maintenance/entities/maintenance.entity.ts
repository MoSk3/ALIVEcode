import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MaintenanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude()
  id: string;

  @Column({ nullable: false })
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @MaxLength(500)
  description?: string;

  @Column({ type: 'timestamp' })
  @IsNotEmpty()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @IsNotEmpty()
  finishDate: Date;

  @Column({ type: 'boolean', default: false })
  @IsOptional()
  started: boolean;

  @Column({ type: 'boolean', default: false })
  @IsOptional()
  finished: boolean;
}
