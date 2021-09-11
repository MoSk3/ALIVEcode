import { Injectable, ExecutionContext, Inject, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { ClassroomService } from '../../models/classroom/classroom.service';
import { REQUEST } from '@nestjs/core';
import { ClassroomEntity } from '../../models/classroom/entities/classroom.entity';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { MyRequest } from './auth.guard';

@Injectable()
export class InClassroomGuard implements CanActivate {
  constructor(private classroomService: ClassroomService, @Inject(REQUEST) private req: MyRequest) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const classroomId = this.req.params.id;
    if (!this.req.params.id) throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);

    const user = this.req.user;
    if (!user) throw new HttpException('Could not get classroom', HttpStatus.INTERNAL_SERVER_ERROR);

    let classroom: ClassroomEntity;
    if (hasRole(user, Role.STAFF)) classroom = await this.classroomService.findOne(classroomId);
    else classroom = await this.classroomService.findClassroomOfUser(user, classroomId);

    this.req.classroom = classroom;
    return true;
  }
}