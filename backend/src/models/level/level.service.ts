import { Injectable } from '@nestjs/common';
import { LevelEntity } from './entities/level.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity) private levelRepository: Repository<LevelEntity>,
    @InjectRepository(LevelAliveEntity) private levelAliveRepo: Repository<LevelAliveEntity>,
    @InjectRepository(LevelCodeEntity) private levelCodeRepo: Repository<LevelCodeEntity>,
  ) {}

  async createLevelAlive(createLevelDto: LevelAliveEntity) {
    return await this.levelAliveRepo.save(this.levelRepository.create(createLevelDto));
  }

  async createLevelCode(createLevelDto: LevelCodeEntity) {
    return await this.levelCodeRepo.save(this.levelRepository.create(createLevelDto));
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
