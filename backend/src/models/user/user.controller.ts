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
import { Auth } from '../../utils/decorators/auth.decorator';
import { UserEntity } from './entities/user.entity';
import { User } from 'src/utils/decorators/user.decorator';
import { Role } from 'src/utils/types/roles.types';
import { hasRole } from './auth';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { QueryDTO } from '../level/dto/query.dto';

@Controller('users')
@UseInterceptors(new DTOInterceptor())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('students')
  async createStudent(@Body() createStudent: StudentEntity) {
    return {
      user: await this.userService.createStudent(createStudent),
    };
  }

  @Post('professors')
  async createProfessor(@Body() createProfessor: ProfessorEntity) {
    return {
      user: await this.userService.createProfessor(createProfessor),
    };
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
  async logout(@Res() res: Response) {
    this.userService.logout(res);
    res.status(200).end();
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
    return user;
  }

  @Get('iot/projects')
  @Auth()
  async getProjects(@User() user: UserEntity) {
    return await this.userService.getIoTProjects(user);
  }

  @Get('iot/objects')
  @Auth()
  async getObjects(@User() user: UserEntity) {
    return await this.userService.getIoTObjects(user);
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

    if (user.id === id) return this.userService.getClassrooms(user);
    return this.userService.getClassrooms(await this.userService.findById(id));
  }

  @Get(':id/courses')
  @Auth()
  async getCourses(@User() user: UserEntity, @Param('id') id: string) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.getCourses(user);
    return this.userService.getClassrooms(await this.userService.findById(id));
  }

  @Post(':id/levels')
  @Auth()
  async getLevels(@User() user: UserEntity, @Param('id') id: string, @Body() query: QueryDTO) {
    if (!hasRole(user, Role.MOD) && user.id !== id) throw new HttpException('You cannot do that', HttpStatus.FORBIDDEN);

    if (user.id === id) return this.userService.getLevels(user, query);
    return this.userService.getLevels(await this.userService.findById(id), query);
  }
}
