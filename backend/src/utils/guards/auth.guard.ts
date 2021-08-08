import { Injectable, CanActivate, ExecutionContext, Scope, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Reflector, REQUEST } from '@nestjs/core';
import { AuthPayload } from '../types/auth.payload';
import { UserEntity } from 'src/user/entities/user.entity';
import { hasRole } from '../../user/auth';
import { Role } from '../types/roles.types';

export interface MyRequest extends Request {
  user: UserEntity;
}

@Injectable({ scope: Scope.REQUEST })
export class isAuth implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private req: MyRequest,
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const authorization = this.req.headers['authorization'];
      if (!authorization) throw Error('Not Authenticated');

      const accessToken = authorization.split(' ')[1];
      const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
      if (!payload) throw Error('Not Authenticated');

      const authPayload = payload as AuthPayload;
      const user = await this.userRepository.findOne(authPayload.id);
      this.req.user = user;
    } catch {
      return false;
    }
    return true;
  }
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
      const roles = this.reflector.get<Role[]>('roles', context.getHandler());
      if (!roles) throw Error('Internal server error');

      const authorization = this.req.headers['authorization'];
      if (!authorization) throw Error('Not Authenticated');

      const accessToken = authorization.split(' ')[1];
      const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
      if (!payload) throw Error('Not Authenticated');

      const authPayload = payload as AuthPayload;
      const user = await this.userRepository.findOne(authPayload.id);

      if (!hasRole(user, ...roles)) throw Error('Forbidden');
      this.req.user = user;
    } catch {
      return false;
    }
    return true;
  }
}