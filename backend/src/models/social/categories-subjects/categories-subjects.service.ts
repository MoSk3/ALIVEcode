import { Injectable } from '@nestjs/common';
import { CreateCategoriesSubjectDto } from './dto/create-categories-subject.dto';
import { UpdateCategoriesSubjectDto } from './dto/update-categories-subject.dto';

@Injectable()
export class CategoriesSubjectsService {
  create(createCategoriesSubjectDto: CreateCategoriesSubjectDto) {
    return 'This action adds a new categoriesSubject';
  }

  findAll() {
    return `This action returns all categoriesSubjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesSubject`;
  }

  update(id: number, updateCategoriesSubjectDto: UpdateCategoriesSubjectDto) {
    return `This action updates a #${id} categoriesSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesSubject`;
  }
}
