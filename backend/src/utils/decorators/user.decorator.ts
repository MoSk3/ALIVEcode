import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MyRequest } from '../guards/auth.guard';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as MyRequest;
  return request.user;
});