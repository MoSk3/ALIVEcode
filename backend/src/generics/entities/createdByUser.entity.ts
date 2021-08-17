import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { IsOptional, IsNotEmpty, Length } from 'class-validator';

@Entity()
export abstract class CreatedByUser {
  @PrimaryGeneratedColumn()
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @Length(3, 25)
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
  description: string;
}