import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Professor } from './entities/professor.entity';
import { Student } from './entities/student.entity';
import { Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  async createStudent(@Body() createStudent: Student) {
    try {
      return await this.userService.createStudent(createStudent);
    } catch {
      throw new HttpException(
        'Impossible to create the student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('professor')
  async createProfessor(@Body() createProfessor: Professor) {
    try {
      return await this.userService.createProfessor(createProfessor);
    } catch (err) {
      throw new HttpException(
        'Impossible to create the professor ' + err,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.userService.login(email, password);
    } catch (err) {
      throw new HttpException('Could not login ' + err, HttpStatus.BAD_REQUEST);
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
    return this.userService.findById(id);
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
