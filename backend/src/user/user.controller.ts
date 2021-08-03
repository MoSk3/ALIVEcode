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
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateProfessorDto } from './dto/create-prof.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  async createStudent(@Body() createStudent: CreateStudentDto) {
    try {
      return await this.userService.createStudent(createStudent);
    } catch {
      throw new HttpException(
        'Impossible to create the student',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('professor')
  async createProfessor(@Body() createProfessor: CreateProfessorDto) {
    try {
      return await this.userService.createProfessor(createProfessor);
    } catch {
      throw new HttpException(
        'Impossible to create the professor',
        HttpStatus.BAD_REQUEST
      )
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
  findOneStudent(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
