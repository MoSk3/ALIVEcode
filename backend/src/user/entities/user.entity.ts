import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';

export enum UserType {
  'Professor',
  'Student',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  is_staff: boolean;

  @Column({ default: false })
  is_super_user: boolean;
}
