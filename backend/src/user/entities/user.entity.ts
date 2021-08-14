import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { LevelEntity } from '../../level/entities/level.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
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
  @Exclude({ toClassOnly: true })
  is_mod: boolean;

  @Column({ default: false })
  @IsOptional()
  @Exclude({ toClassOnly: true })
  is_admin: boolean;

  @Column({ default: false })
  @IsOptional()
  @Exclude({ toClassOnly: true })
  is_super_user: boolean;

  @OneToMany(() => LevelEntity, level => level.creator, { cascade: true })
  levels: LevelEntity[];
} 