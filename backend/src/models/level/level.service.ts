import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LevelEntity, LEVEL_ACCESS } from './entities/level.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LevelProgressionEntity } from './entities/levelProgression.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity) private levelRepository: Repository<LevelEntity>,
    @InjectRepository(LevelAliveEntity) private levelAliveRepo: Repository<LevelAliveEntity>,
    @InjectRepository(LevelCodeEntity) private levelCodeRepo: Repository<LevelCodeEntity>,
    @InjectRepository(LevelProgressionEntity) private levelProgressionRepo: Repository<LevelProgressionEntity>,
  ) {}

  async createLevelAlive(creator: UserEntity, createLevelDto: LevelAliveEntity) {
    const level = this.levelAliveRepo.create({ ...createLevelDto, creator });
    return await this.levelAliveRepo.save(level);
  }

  async createLevelCode(creator: UserEntity, createLevelDto: LevelCodeEntity) {
    const level = this.levelCodeRepo.create({ ...createLevelDto, creator });
    return await this.levelCodeRepo.save(level);
  }

  async findAll() {
    return await this.levelRepository.find();
  }

  async findQuery() {
    return await this.levelRepository.find({ where: { access: LEVEL_ACCESS.PUBLIC } });
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const course = await this.levelRepository.findOne(id);
    if (!course) throw new HttpException('Level not found', HttpStatus.NOT_FOUND);
    return course;
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

  async getProgression(levelId: string, user: UserEntity) {
    const progression = await this.levelProgressionRepo.findOne({ where: { levelId, user } });
    if (!progression) throw new HttpException('Progression not found', HttpStatus.NOT_FOUND);
    return progression;
  }

  async updateProgression(levelId: string, user: UserEntity, updateProgressionDto: LevelProgressionEntity) {
    let progression: LevelProgressionEntity;
    try {
      progression = await this.getProgression(levelId, user);
    } catch {
      progression = this.levelProgressionRepo.create(updateProgressionDto);
    }
    return await this.levelProgressionRepo.save({
      ...updateProgressionDto,
      id: progression.id,
      levelId,
      user,
    });
  }
}
