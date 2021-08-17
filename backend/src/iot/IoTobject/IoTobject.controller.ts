import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { IoTObjectEntity } from './entities/IoTobject.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';
import { User } from 'src/utils/decorators/user.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import { hasRole } from '../../user/auth';
import { IoTObjectService } from './IoTobject.service';

@Controller('IoTobject')
export class IoTObjectController {
  constructor(private readonly IoTObjectService: IoTObjectService) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createIoTobjectDto: IoTObjectEntity) {
    return await this.IoTObjectService.create(user, createIoTobjectDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.IoTObjectService.findAll();
  }

  @Get(':id')
  @Auth(Role.STAFF)
  async findOne(@Param('id') id: string) {
    return await this.IoTObjectService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateIoTobjectDto: IoTObjectEntity) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const IoTObject = await this.IoTObjectService.findOne(id);
    if (IoTObject.creator.id !== id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTObjectService.update(IoTObject.id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const IoTObject = await this.IoTObjectService.findOne(id);
    if (IoTObject.creator.id !== id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTObjectService.remove(id);
  }
}
