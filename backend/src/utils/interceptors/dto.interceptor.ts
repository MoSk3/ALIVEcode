import { CallHandler, Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { Response } from 'express';

@Injectable()
export class DTOInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Record<string, any>> {
    const response: Response = context.switchToHttp().getResponse();
    response.setHeader('Access-Control-Allow-Origin', 'localhost:3000');
    console.log(response.getHeaders());
    return next.handle().pipe(map(data => classToPlain(data)));
  }
}