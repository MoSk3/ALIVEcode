import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, Length, Matches } from 'class-validator';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { LevelEntity } from '../../level/entities/level.entity';
import { IoTObjectEntity } from '../../iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';
import { LevelProgressionEntity } from '../../level/entities/levelProgression.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  id: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  @Length(6, 32)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9!@#\$&*~]*$/)
  password: string;

  @Column({ unique: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ default: false })
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  @Expose({ groups: ['admin', 'user'] })
  isMod: boolean;

  @Column({ default: false })
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  @Expose({ groups: ['admin', 'user'] })
  isAdmin: boolean;

  @Column({ default: false })
  @IsEmpty()
  @Exclude({ toClassOnly: true })
  @Expose({ groups: ['admin', 'user'] })
  isSuperUser: boolean;

  @OneToMany(() => LevelEntity, level => level.creator, { cascade: true })
  levels: LevelEntity[];

  @OneToMany(() => AsScriptEntity, asScript => asScript.creator, { cascade: true })
  asScripts: AsScriptEntity[];

  @OneToMany(() => IoTObjectEntity, iot => iot.creator, { cascade: true })
  IoTObjects: IoTObjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator, { cascade: true })
  IoTProjects: IoTProjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator, { cascade: true })
  collabIoTProjects: IoTProjectEntity[];

  @OneToMany(() => LevelProgressionEntity, prog => prog.user, { cascade: true })
  levelProgressions: LevelProgressionEntity[];
} 