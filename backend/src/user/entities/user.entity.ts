import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { LevelEntity } from '../../level/entities/level.entity';
import { IoTObjectEntity } from '../../iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../iot/IoTproject/entities/IoTproject.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';

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

  @OneToMany(() => AsScriptEntity, asScript => asScript.creator, { cascade: true })
  asScripts: AsScriptEntity[];

  @OneToMany(() => IoTObjectEntity, iot => iot.creator, { cascade: true })
  IoTObjects: IoTObjectEntity[];

  @OneToMany(() => IoTObjectEntity, iot => iot.creator, { cascade: true })
  IoTProjects: IoTObjectEntity[];

  @OneToMany(() => IoTProjectEntity, iot => iot.creator, { cascade: true })
  collabIoTProjects: IoTObjectEntity[];
} 