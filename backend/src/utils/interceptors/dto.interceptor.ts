import { CallHandler, Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { Groups } from '../metadata/groupsTransformer.metadata';

@Injectable()
export class DTOInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Record<string, any>> {
    const groups = this.reflector.get<Groups[]>('groups', context.getHandler());
    return next.handle().pipe(map(data => classToPlain(data, { groups: groups ?? [] })));
  }
}