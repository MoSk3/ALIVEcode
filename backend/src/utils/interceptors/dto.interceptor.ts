import { CallHandler, Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';

@Injectable()
export class DTOInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Record<string, any>> {
    return next.handle().pipe(map(data => classToPlain(data)));
  }
}