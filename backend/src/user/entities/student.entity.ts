import { Column, ChildEntity } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Student extends User {
  @Column()
  name: string;
}
