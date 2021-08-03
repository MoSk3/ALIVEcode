import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  email: string;

  @Column({ default: false })
  is_staff: boolean;

  @Column({ default: false })
  is_super_user: boolean;
}
