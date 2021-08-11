import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import config from 'ormconfig';
import { UserEntity } from '../user/entities/user.entity';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { UserService } from '../user/user.service';
import { StudentEntity } from '../user/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([ClassroomEntity, UserEntity, ProfessorEntity, StudentEntity]),
    DefaultAdminModule,
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, UserService],
})
export class ClassroomModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('Classroom', ClassroomEntity);
  }
}
