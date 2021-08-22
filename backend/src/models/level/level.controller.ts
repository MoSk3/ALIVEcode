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
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';
import { User } from 'src/utils/decorators/user.decorator';
import { LevelEntity } from './entities/level.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';

@Controller('level')
@UseInterceptors(new DTOInterceptor())
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  @Auth()
  async create(@Body() createLevelDto: LevelEntity) {
    return await this.levelService.create(createLevelDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.levelService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const level = await this.levelService.findOne(id);
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
