import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { LevelService } from './level.service';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';
import { User } from 'src/utils/decorators/user.decorator';
import { LevelEntity, LEVEL_ACCESS } from './entities/level.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';

@Controller('level')
@UseInterceptors(new DTOInterceptor())
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post('alive')
  @Auth()
  async createLevelAlive(@Body() createLevelDto: LevelAliveEntity) {
    return await this.levelService.createLevelAlive(createLevelDto);
  }

  @Post('code')
  @Auth()
  async createLevelCode(@Body() createLevelDto: LevelCodeEntity) {
    return await this.levelService.createLevelCode(createLevelDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.levelService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const level = await this.levelService.findOne(id);
    if (level.creator.id === user.id || hasRole(user, Role.STAFF)) return level;
    if (level.access === LEVEL_ACCESS.PRIVATE || level.access === LEVEL_ACCESS.RESTRICTED)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return level;
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateLevelDto: LevelEntity) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const level = await this.levelService.findOne(id);

    if (level.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const level = await this.levelService.findOne(id);

    if (level.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.levelService.remove(id);
  }
}
