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
import { UserService } from '../user/user.service';

@Controller('classrooms')
@UseInterceptors(new DTOInterceptor())
@Injectable()
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly userService: UserService,
    @InjectRepository(ProfessorEntity) private professorRepository: Repository<ProfessorEntity>,
  ) {}

  @Get('test')
  async tests() {
    const professor = this.professorRepository.create({
      email: '7@gmail.com',
      firstName: 'Bob',
      lastName: 'lajoie',
      password: '123456',
    });

    const classroom = await this.classroomService.testCreate('CLASSE EPIC', professor);
    if (professor.classrooms) professor.classrooms.push(classroom);
    else professor.classrooms = [classroom];

    await this.professorRepository.save(professor);
    return {
      classroom,
      professor,
    };
  }

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() professor: ProfessorEntity, @Body() createClassroomDto: ClassroomEntity) {
    professor = await this.professorRepository.findOne(professor);
    return await this.classroomService.create(createClassroomDto, professor);
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
