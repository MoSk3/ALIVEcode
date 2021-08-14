import { Injectable } from '@nestjs/common';
import { CourseEntity } from './entities/course.entity';

@Injectable()
export class CourseService {
  create(createCourseDto: CourseEntity) {
    return 'This action adds a new course';
  }

  findAll() {
    return `This action returns all course`;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: CourseEntity) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
