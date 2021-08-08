import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { DefaultAdminModule } from 'nestjs-admin';
import config from 'ormconfig';
import { UserEntity } from '../user/entities/user.entity';
import { ProfessorEntity } from '../user/entities/professor.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([ClassroomEntity, UserEntity, ProfessorEntity]),
    DefaultAdminModule,
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
