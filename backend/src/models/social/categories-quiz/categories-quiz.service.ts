import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriesQuizDto } from './dto/create-categories-quiz.dto';
import { UpdateCategoriesQuizDto } from './dto/update-categories-quiz.dto';
import { CategoriesQuiz } from './entities/categories-quiz.entity';

@Injectable()
export class CategoriesQuizService {
  constructor(
    @InjectRepository(CategoriesQuiz) private CategoriesRepository: Repository<CategoriesQuiz>,
  ) {}


  create(createCategoriesQuizDto: CreateCategoriesQuizDto) {
    return 'This action adds a new categoriesQuiz';
  }

  async findAll() {
    return await this.CategoriesRepository.find({ relations: ['quizzes'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesQuiz`;
  }

  update(id: number, updateCategoriesQuizDto: UpdateCategoriesQuizDto) {
    return `This action updates a #${id} categoriesQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesQuiz`;
  }
}
