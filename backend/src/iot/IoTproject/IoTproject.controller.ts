import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { IoTProjectService } from './IoTproject.service';
import { UserEntity } from '../../user/entities/user.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { Role } from '../../utils/types/roles.types';
import { hasRole } from '../../user/auth';
import { IoTProjectEntity, IOTPROJECT_ACCESS } from './entities/IoTproject.entity';

@Controller('iot/projects')
export class IoTProjectController {
  constructor(private readonly IoTProjectService: IoTProjectService) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createIoTobjectDto: IoTProjectEntity) {
    return await this.IoTProjectService.create(user, createIoTobjectDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.IoTProjectService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF)) return project;
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return project;
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateIoTobjectDto: IoTProjectEntity) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const IoTProject = await this.IoTProjectService.findOne(id);
    if (IoTProject.creator.id !== id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.update(IoTProject.id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const IoTProject = await this.IoTProjectService.findOne(id);
    if (IoTProject.creator.id !== id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.remove(id);
  }
}
