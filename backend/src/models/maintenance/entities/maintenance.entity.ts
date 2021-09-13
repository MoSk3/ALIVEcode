import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MaintenanceEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  finishDate: Date;

  @Column({ type: 'boolean' })
  started: boolean;

  @Column({ type: 'boolean' })
  finished: boolean;
}
