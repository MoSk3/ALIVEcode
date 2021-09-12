import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomEntity } from './entities/classroom.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';
import { User } from 'src/utils/decorators/user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { StudentEntity } from '../user/entities/student.entity';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';

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
  async create(@User() professor: ProfessorEntity, @Body() createClassroomDto: ClassroomEntity) {
    professor = await this.professorRepository.findOne(professor);
    return await this.classroomService.create(createClassroomDto, professor);
  }

  @Get()
  async findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id/courses')
  @Auth()
  async getCourses(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    let classroom: ClassroomEntity;
    if (hasRole(user, Role.STAFF)) classroom = await this.classroomService.findOne(id);
    else {
      if (!(user instanceof ProfessorEntity) && !(user instanceof StudentEntity))
        throw new HttpException('', HttpStatus.FORBIDDEN);

      classroom = await this.classroomService.findClassroomOfUser(user, id);
    }
    return await this.classroomService.getCourses(classroom);
  }

  @Get(':id/students')
  @Auth()
  async getStudents(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    let classroom: ClassroomEntity;
    if (hasRole(user, Role.STAFF)) classroom = await this.classroomService.findOne(id);
    else {
      if (!(user instanceof ProfessorEntity) && !(user instanceof StudentEntity))
        throw new HttpException('', HttpStatus.FORBIDDEN);

      classroom = await this.classroomService.findClassroomOfUser(user, id);
    }
    return await this.classroomService.getStudents(classroom);
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    if (hasRole(user, Role.STAFF)) return await this.classroomService.findOne(id);

    if (!(user instanceof ProfessorEntity) && !(user instanceof StudentEntity))
      throw new HttpException('', HttpStatus.FORBIDDEN);

    return await this.classroomService.findClassroomOfUser(user, id);
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
