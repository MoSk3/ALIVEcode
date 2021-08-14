import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { Repository } from 'typeorm';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { UserEntity } from '../user/entities/user.entity';
import { StudentEntity } from '../user/entities/student.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ProfessorEntity) private professorRepository: Repository<ProfessorEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async create(createClassroomDto: ClassroomEntity, professor: ProfessorEntity) {
    const classroom = this.classroomRepository.create(createClassroomDto);
    classroom.creator = professor;
    await this.classroomRepository.save(classroom);

    return classroom;
  }

  findAll() {
    return this.classroomRepository.find();
  }

  findOne(id: string) {
    return this.classroomRepository.findOne(id);
  }

  update(id: string, updateClassroomDto: ClassroomEntity) {
    return this.classroomRepository.update(id, updateClassroomDto);
  }

  async remove(id: string) {
    return this.classroomRepository.remove(await this.findOne(id));
  }

  async findClassroomOfUser(user: UserEntity, id: string) {
    let classroom: ClassroomEntity;

    if (user instanceof ProfessorEntity)
      classroom = await this.classroomRepository.findOne(id, { where: { creator: user } });
    // TODO: add find classroom of student
    else if (user instanceof StudentEntity) {
    }

    if (!classroom) throw new HttpException('Classe not found', HttpStatus.NOT_FOUND);
    return classroom;
  }
}
