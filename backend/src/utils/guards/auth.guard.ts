import { Injectable, CanActivate, ExecutionContext, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Reflector, REQUEST } from '@nestjs/core';
import { AuthPayload } from '../types/auth.payload';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { ClassroomEntity } from '../../models/classroom/entities/classroom.entity';

export interface MyRequest extends Request {
  user: UserEntity;
  classroom?: ClassroomEntity;
}

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private req: MyRequest,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      let roles = this.reflector.get<Role[]>('roles', context.getHandler());
      if (!roles) roles = [];

      const authorization = this.req.headers['authorization'];
      if (!authorization) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

      const accessToken = authorization.split(' ')[1];
      const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
      if (!payload) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

      const authPayload = payload as AuthPayload;
      const user = await this.userRepository.findOne(authPayload.id);
      if (!user) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

      if (!hasRole(user, ...roles)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      this.req.user = user;
    } catch (err) {
      if (err instanceof JsonWebTokenError && err.name === 'TokenExpiredError')
        throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);
      if (err instanceof HttpException) throw err;
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
  }
}