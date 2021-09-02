import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelEntity } from './entities/level.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LevelEntity, UserEntity, LevelAliveEntity, LevelCodeEntity])],
  controllers: [LevelController],
  providers: [LevelService],
})
export class LevelModule {}
