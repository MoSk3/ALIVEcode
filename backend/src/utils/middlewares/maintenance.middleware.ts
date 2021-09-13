import { NextFunction } from "express";
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { MyRequest } from '../guards/auth.guard';
import { MaintenanceService } from '../../models/maintenance/maintenance.service';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(private readonly maintenanceService: MaintenanceService) {}
  async use(req: MyRequest, res: Response, next: NextFunction) {
    const user = req.user;
    const maintenance = await this.maintenanceService.getCurrentMaintenance();
    if (maintenance && (!user || !user.isAdmin))
      throw new HttpException('Server is in maintenance', HttpStatus.SERVICE_UNAVAILABLE);
    next();
  }
}