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
import { UserService } from '../user/user.service';
import { LevelProgressionEntity } from './entities/levelProgression.entity';
import { QueryDTO } from './dto/query.dto';

@Controller('levels')
@UseInterceptors(new DTOInterceptor())
export class LevelController {
  constructor(private readonly levelService: LevelService, private readonly userService: UserService) {}

  @Post('alive')
  @Auth()
  async createLevelAlive(@User() user: UserEntity, @Body() createLevelDto: LevelAliveEntity) {
    return await this.levelService.createLevelAlive(user, createLevelDto);
  }

  @Post('code')
  @Auth()
  async createLevelCode(@User() user: UserEntity, @Body() createLevelDto: LevelCodeEntity) {
    return await this.levelService.createLevelCode(user, createLevelDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.levelService.findAll();
  }

  @Post('query')
  @Auth()
  async findQuery(@Body() query: QueryDTO) {
    return await this.levelService.findQuery(query);
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const level = await this.levelService.findOne(id);
    if (level.creator.id === user.id || hasRole(user, Role.STAFF)) return level;
    if (level.access === LEVEL_ACCESS.PRIVATE || level.access === LEVEL_ACCESS.RESTRICTED)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return level;
  }

  @Get(':id/progressions/:userId')
  @Auth()
  async getProgression(@User() user: UserEntity, @Param('id') id: string, @Param('userId') userId: string) {
    if (user.id !== userId && !hasRole(user, Role.STAFF)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const target = await this.userService.findById(userId);
    return this.levelService.getProgression(id, target);
  }

  @Patch(':id/progressions/:userId')
  @Auth()
  async updateProgression(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateProgressionDto: LevelProgressionEntity,
  ) {
    if (user.id !== userId && !hasRole(user, Role.STAFF)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const target = await this.userService.findById(userId);
    return this.levelService.updateProgression(id, target, updateProgressionDto);
  }

  @Patch(':id')
  @Auth()
  async update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() updateLevelDto: LevelEntity | LevelCodeEntity | LevelAliveEntity,
  ) {
    const level = await this.levelService.findOne(id);

    if (level.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.levelService.update(id, updateLevelDto);
  }

  @Patch('alive/:id')
  @Auth()
  async updateAlive(@User() user: UserEntity, @Param('id') id: string, @Body() updateLevelDto: LevelAliveEntity) {
    const level = await this.levelService.findOne(id);

    if (level.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.levelService.update(id, updateLevelDto);
  }

  @Patch('code/:id')
  @Auth()
  async updateCode(@User() user: UserEntity, @Param('id') id: string, @Body() updateLevelDto: LevelCodeEntity) {
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
