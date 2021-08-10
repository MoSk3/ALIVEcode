import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Injectable } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomEntity } from './entities/classroom.entity';
import { DTOInterceptor } from '../utils/interceptors/dto.interceptor';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';
import { User } from 'src/utils/decorators/user.decorator';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('classrooms')
@UseInterceptors(new DTOInterceptor())
@Injectable()
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    @InjectRepository(ProfessorEntity) private professorRepository: Repository<ProfessorEntity>,
  ) {}

  @Post()
  @Auth(Role.PROFESSOR)
  create(@User() professor: ProfessorEntity, @Body() createClassroomDto: ClassroomEntity) {
    return this.classroomService.create(createClassroomDto, professor);
  }

  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    if (hasRole(user, Role.STAFF)) return this.classroomService.findOne(id);

    const prof = await this.professorRepository.findOne(user, { relations: ['classrooms'] });
    console.log(prof);
    console.log(prof.classrooms);
    /*if (!(user instanceof ProfessorEntity) && !(user instanceof StudentEntity))
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    console.log(user);
    const classroom = user.classrooms.find(classroom => classroom.id === id);
    if (!classroom) throw new HttpException('', HttpStatus.NOT_FOUND);

    return this.classroomService.findOne(id);*/
    return {};
  }

  @Patch(':id')
  @Auth(Role.STAFF)
  update(@Param('id') id: string, @Body() updateClassroomDto: ClassroomEntity) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @Auth(Role.PROFESSOR)
  remove(@Param('id') id: string) {
    return this.classroomService.remove(id);
  }
}
