import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import config from '../../ormconfig';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfessorEntity, StudentEntity, ClassroomEntity]),
    DefaultAdminModule,
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('User', UserEntity);
  }
}
