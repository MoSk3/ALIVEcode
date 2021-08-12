import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { Param } from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserEntity } from './entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { Role } from 'src/utils/types/roles.types';
import { hasRole } from './auth';
import { DTOInterceptor } from '../utils/interceptors/dto.interceptor';

@Controller('users')
@UseInterceptors(new DTOInterceptor())
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

  @Post('login')
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
  async refreshToken(@Res({ passthrough: true }) res: Response) {
    return await this.userService.refreshToken(res);
  }

  @Get()
  //@Auth(Role.MOD)
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

  @Get('me')
  @Auth()
  me(@User() user: UserEntity) {
    console.log(user);
    return user;
  }

  @Get(':id')
  @Auth()
  findOneStudent(@User() user: UserEntity, @Param('id') id: string) {
    if (user.id === id) return user;
    if (!hasRole(user, Role.MOD)) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateUserDto: UserEntity) {
    if (!hasRole(user, Role.MOD)) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.update(user, updateUserDto);
    return this.userService.update(await this.userService.findById(id), updateUserDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.remove(user);
    return this.userService.remove(await this.userService.findById(id));
  }

  @Get(':id/classrooms')
  @Auth()
  async getClassrooms(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    console.log(this.userService.getClassrooms(user));
    if (user.id === id) return this.userService.getClassrooms(user);
    return this.userService.getClassrooms(await this.userService.findById(id));
  }
}
