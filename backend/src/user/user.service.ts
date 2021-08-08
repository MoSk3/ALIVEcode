import { Injectable, HttpException, HttpStatus, Scope, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { UserEntity } from './entities/user.entity';
import { classToPlain } from 'class-transformer';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { createAccessToken, setRefreshToken, createRefreshToken } from './auth';
import { verify } from 'jsonwebtoken';
import { AuthPayload } from '../utils/types/auth.payload';
import { MyRequest } from 'src/utils/guards/auth.guard';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfessorEntity)
    private professorRepository: Repository<ProfessorEntity>,
    @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
    @Inject(REQUEST) private req: MyRequest,
  ) {}

  async createStudent(createStudentDto: UserEntity) {
    // TODO: random salt
    const hashedPassword = await hash(createStudentDto.password, 12);
    createStudentDto.password = hashedPassword;

    try {
      const student = await this.studentRepository.save(this.studentRepository.create(createStudentDto));
      delete student.password;
      return student;
    } catch {
      throw new HttpException('This email is already in use', HttpStatus.CONFLICT);
    }
  }

  async createProfessor(createProfessorDto: ProfessorEntity) {
    const hashedPassword = await hash(createProfessorDto.password, 12);
    createProfessorDto.password = hashedPassword;

    try {
      const professor = await this.professorRepository.save(this.professorRepository.create(createProfessorDto));
      delete professor.password;
      return professor;
    } catch {
      throw new HttpException('This email is already in use', HttpStatus.CONFLICT);
    }
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw 'Error';
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw 'Error';
    }

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  logout(res: Response) {
    setRefreshToken(res, '');
    return {};
  }

  async refreshToken(res: Response) {
    const req = this.req;
    const authorization = req.headers['authorization'];
    if (!authorization) throw new HttpException('Not Authenticated', HttpStatus.BAD_REQUEST);

    const refreshToken = req.cookies.wif;
    if (!refreshToken) throw new HttpException('No credentials were provided', HttpStatus.BAD_REQUEST);

    const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY) as AuthPayload;
    if (!payload) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const user = await this.findById(payload.id);
    if (!user) throw new HttpException('', HttpStatus.UNAUTHORIZED);

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  findAll() {
    return classToPlain(this.userRepository.find());
  }

  findAllProfs() {
    return classToPlain(this.professorRepository.find());
  }

  findAllStudents() {
    return classToPlain(this.studentRepository.find());
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findById(id: string) {
    return await this.userRepository.findOne(id);
  }

  update(id: string, updateUserDto: UserEntity) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.remove(await this.findById(id));
  }
}
