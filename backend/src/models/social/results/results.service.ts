import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { QueryDTO } from 'src/models/level/dto/query.dto';
import { LEVEL_ACCESS } from 'src/models/level/entities/level.entity';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { Repository, ILike, RelationId } from 'typeorm';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result } from './entities/result.entity';

@Injectable()
export class ResultsService {
  [x: string]: any;
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
  ) {}
  create(createResultDto: CreateResultDto) {
    return 'This action adds a new result';
  }

  findAll() {
    return `This action returns all results`;
  }

  findOne(id: number) {
    return `This action returns a #${id} result`;
  }

  getResults() {
  return  this.resultRepository.find({
  relations: ['user'],
    
    })
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
