import { Injectable } from '@nestjs/common';
import { LevelEntity } from './entities/level.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LevelService {
  constructor(@InjectRepository(LevelEntity) private levelRepository: Repository<LevelEntity>) {}

  async create(createLevelDto: LevelEntity) {
    return await this.levelRepository.save(this.levelRepository.create(createLevelDto));
  }

  async findAll() {
    return await this.levelRepository.find();
  }

  async findOne(id: string) {
    return await this.levelRepository.findOne(id);
  }

  async update(id: string, updateLevelDto: LevelEntity) {
    return await this.levelRepository.save({
      id,
      ...updateLevelDto,
    });
  }

  async remove(id: string) {
    return await this.levelRepository.remove(await this.findOne(id));
  }
}
