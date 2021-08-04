import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Professor } from './entities/professor.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';
import { classToPlain } from 'class-transformer';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async createStudent(createStudentDto: User) {
    // TODO: random salt
    const hashedPassword = await hash(createStudentDto.password, 12);
    createStudentDto.password = hashedPassword;

    const student = await this.studentRepository.save(
      this.studentRepository.create(createStudentDto),
    );
    delete student.password;
    return student;
  }

  async createProfessor(createProfessorDto: Professor) {
    // TODO: random salt
    const hashedPassword = await hash(createProfessorDto.password, 12);
    createProfessorDto.password = hashedPassword;

    const professor = await this.professorRepository.save(
      this.professorRepository.create(createProfessorDto),
    );
    delete professor.password;
    return professor;
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw 'Error';
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw 'Error';
    }

    return {
      refreshToken: '',
      accessToken: '',
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  findAllProfs() {
    return classToPlain(this.professorRepository.find());
  }

  findAllStudents() {
    return this.studentRepository.find();
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findById(id: string) {
    return await this.userRepository.findOne(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.remove(await this.findById(id));
  }
}
