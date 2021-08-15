import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity, COURSE_ACCESS } from './entities/course.entity';
import { DTOInterceptor } from '../utils/interceptors/dto.interceptor';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';
import { User } from 'src/utils/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { ProfessorEntity } from '../user/entities/professor.entity';

@Controller('course')
@UseInterceptors(new DTOInterceptor())
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() user: ProfessorEntity, @Body() createCourseDto: CourseEntity) {
    return await this.courseService.create(user, createCourseDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.courseService.findAll();
  }

  // TODO : decide of a good way to manage errors (ex: totally hide the fact that the access
  // is denied by saying not found?)
  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string, @Query('code') code: string) {
    const course = await this.courseService.findOne(id);

    if (course.creator.id === user.id || hasRole(user, Role.STAFF)) return course;
    if (course.access === COURSE_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    if (course.access === COURSE_ACCESS.RESTRICTED && course.code !== code)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return course;
  }

  @Patch(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateCourseDto: CourseEntity) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.remove(course);
  }
}
