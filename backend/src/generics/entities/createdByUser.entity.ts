import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../models/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { IsOptional, IsNotEmpty, Length, IsEmpty, MaxLength, Matches } from 'class-validator';

@Entity()
export abstract class CreatedByUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/[\w ]*/, { message: 'form.error.match.name' })
  name: string;

  abstract creator: UserEntity;

  @CreateDateColumn()
  @Exclude({ toClassOnly: true })
  creationDate: Date;

  @UpdateDateColumn()
  @Exclude({ toClassOnly: true })
  updateDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @MaxLength(200)
  description: string;

  @Column({ nullable: true })
  @IsOptional()
  image: string;
  
}