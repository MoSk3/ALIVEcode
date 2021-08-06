import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';

export enum UserType {
  'Professor',
  'Student',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ default: false })
  @IsOptional()
  @Exclude()
  is_staff: boolean;

  @Column({ default: false })
  @IsOptional()
  @Exclude()
  is_super_user: boolean;
}
