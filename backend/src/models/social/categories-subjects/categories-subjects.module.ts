import { Module } from '@nestjs/common';
import { CategoriesSubjectsService } from './categories-subjects.service';
import { CategoriesSubjectsController } from './categories-subjects.controller';

@Module({
  controllers: [CategoriesSubjectsController],
  providers: [CategoriesSubjectsService]
})
export class CategoriesSubjectsModule {}
