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
} from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  async create(@Body() createLevelDto: CreateLevelDto) {
    try {
      return await this.levelService.create(createLevelDto);
    } catch (err) {
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.levelService.findAll();
    } catch (err) {
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.levelService.findOne(id);
    } catch {
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    try {
      return await this.levelService.update(id, updateLevelDto);
    } catch (err) {
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.levelService.remove(id);
    } catch (err) {
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }
}
