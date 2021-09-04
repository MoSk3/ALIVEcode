import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { SectionEntity } from './entities/section.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, SectionEntity, UserEntity])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
