import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MaintenanceEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude()
  id: string;

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
