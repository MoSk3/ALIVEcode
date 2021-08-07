import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomService {
  create(createClassroomDto: CreateClassroomDto) {
    return 'This action adds a new classroom';
  }

  findAll() {
    return `This action returns all classroom`;
  }

  findOne(id: string) {
    return `This action returns a #${id} classroom`;
  }

  update(id: string, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  remove(id: string) {
    return `This action removes a #${id} classroom`;
  }
}
