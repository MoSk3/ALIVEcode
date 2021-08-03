import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Professor } from './entities/professor.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateProfessorDto } from './dto/create-prof.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto) {
    if (!createStudentDto.name) throw new Error();

    return await this.studentRepository.save(
      this.studentRepository.create(createStudentDto),
    );
  }

  async createProfessor(createProfessorDto: CreateProfessorDto) {
    if (!createProfessorDto.firstName || !createProfessorDto.lastName)
      throw new Error();

    return await this.professorRepository.save(
      this.professorRepository.create(createProfessorDto),
    );
  }

  findAll() {
    return this.userRepository.find();
  }

  findAllProfs() {
    return this.professorRepository.find();
  }

  findAllStudents() {
    return this.studentRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.remove(await this.findOne(id));
  }
}
