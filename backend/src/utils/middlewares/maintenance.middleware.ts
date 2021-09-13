import { NextFunction } from "express";
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaintenanceEntity } from '../../models/maintenance/entities/maintenance.entity';
import { Repository } from 'typeorm';
import { MyRequest } from '../guards/auth.guard';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(@InjectRepository(MaintenanceEntity) private maintenanceRepo: Repository<MaintenanceEntity>) {}
  async use(req: MyRequest, res: Response, next: NextFunction) {
    const user = req.user;
    const maintenance = await this.maintenanceRepo.findOne({ where: { started: true, finished: false } });
    if (maintenance && (!user || !user.isAdmin))
      throw new HttpException('Server is in maintenance', HttpStatus.SERVICE_UNAVAILABLE);
    next();
  }
}