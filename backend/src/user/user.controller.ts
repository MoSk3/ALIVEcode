import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateProfessorDto } from './dto/create-prof.dto';
import { Professor } from './entities/professor.entity';
import { Student } from './entities/student.entity';
import { hasValidFields } from '../utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  async createStudent(@Body() createStudent: CreateStudentDto) {
    try {
      if (!hasValidFields(Student, createStudent)) throw new Error();
      return await this.userService.createStudent(createStudent);
    } catch {
      throw new HttpException(
        'Impossible to create the student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('professor')
  async createProfessor(@Body() createProfessor: CreateProfessorDto) {
    try {
      if (!hasValidFields(Professor, createProfessor)) throw new Error();
      return await this.userService.createProfessor(createProfessor);
    } catch {
      throw new HttpException(
        'Impossible to create the professor',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('professor')
  findAllProfs() {
    return this.userService.findAllProfs();
  }

  @Get('student')
  findAllStudents() {
    return this.userService.findAllStudents();
  }

  @Get(':id')
  findOne(id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (
      (user instanceof Student && hasValidFields(Student, updateUserDto)) ||
      (user instanceof Professor && hasValidFields(Professor, updateUserDto))
    ) {
      return this.userService.update(id, updateUserDto);
    } else {
      throw new HttpException(
        'Impossible to update the model with the specified fields',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
