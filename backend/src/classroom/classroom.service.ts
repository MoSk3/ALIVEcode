import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { Repository } from 'typeorm';
import { ProfessorEntity } from '../user/entities/professor.entity';

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

    professor.classrooms = [classroom];
    await this.professorRepository.save(professor);

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
}
