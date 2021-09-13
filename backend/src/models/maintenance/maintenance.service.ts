import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MaintenanceEntity } from './entities/maintenance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class MaintenanceService {
  constructor(@InjectRepository(MaintenanceEntity) private maintenanceRepo: Repository<MaintenanceEntity>) {}

  async create(createMaintenanceDto: MaintenanceEntity) {
    return await this.maintenanceRepo.save(this.maintenanceRepo.create(createMaintenanceDto));
  }

  async findAll() {
    return await this.maintenanceRepo.find();
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const maintenance = await this.maintenanceRepo.findOne(id);
    if (!maintenance) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return maintenance;
  }

  async findUpcoming() {
    const maintenance = await this.maintenanceRepo.findOne({
      where: { startDate: Raw(alias => `${alias} > :date`, { date: Date.now() - 1000 * 60 * 60 * 24 }) },
    });
    if (!maintenance) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return maintenance;
  }

  async update(id: string, updateMaintenanceDto: MaintenanceEntity) {
    return await this.maintenanceRepo.save({
      id,
      ...updateMaintenanceDto,
    });
  }

  async remove(id: string) {
    return await this.maintenanceRepo.delete(id);
  }
}
