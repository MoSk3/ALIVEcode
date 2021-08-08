import { Controller, Get, Post, Body, Patch, Delete, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { Param } from '@nestjs/common';
import { Response } from 'express';
import { MyRequest } from 'src/utils/guards/auth.guard';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserEntity } from './entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { Role } from 'src/utils/types/roles.types';
import { hasRole } from './auth';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('students')
  async createStudent(@Body() createStudent: StudentEntity) {
    return await this.userService.createStudent(createStudent);
  }

  @Post('professors')
  async createProfessor(@Body() createProfessor: ProfessorEntity) {
    return await this.userService.createProfessor(createProfessor);
  }

  @Get('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return await this.userService.login(email, password, res);
    } catch (err) {
      throw new HttpException('Could not login ' + err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('logout')
  @Auth()
  logout(@Res() res: Response) {
    return this.userService.logout(res);
  }

  @Post('refreshToken')
  @Auth()
  async refreshToken(@Req() req: MyRequest, @Res({ passthrough: true }) res: Response) {
    return await this.userService.refreshToken(res);
  }

  @Get()
  @Auth(Role.MOD)
  findAll() {
    return this.userService.findAll();
  }

  @Get('professors')
  @Auth(Role.MOD)
  findAllProfs() {
    return this.userService.findAllProfs();
  }

  @Get('students')
  @Auth(Role.MOD)
  findAllStudents() {
    return this.userService.findAllStudents();
  }

  @Get(':id')
  @Auth()
  findOneStudent(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Auth()
  update(@User() user: UserEntity, @Param('id') id: string, @Body() updateUserDto: UserEntity) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);
    return this.userService.remove(id);
  }
}
