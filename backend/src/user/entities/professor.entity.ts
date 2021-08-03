import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Professor extends User {
  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
