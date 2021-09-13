import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceEntity } from './entities/maintenance.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/types/roles.types';

@Controller('maintenances')
@UseInterceptors(DTOInterceptor)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createMaintenanceDto: MaintenanceEntity) {
    return await this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  async findAll() {
    return await this.maintenanceService.findAll();
  }

  @Get('upcoming')
  @Auth()
  async findUpcoming() {
    return await this.maintenanceService.findUpcoming();
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.maintenanceService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateMaintenanceDto: MaintenanceEntity) {
    return await this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.maintenanceService.remove(id);
  }
}
