import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MyRequest } from '../guards/auth.guard';
import { serialKey } from './getterDefault.decorators';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as MyRequest;
  // Used to set a default [] for empty relationships
  Object.defineProperty(request.user, serialKey, {
    value: true,
  });
  return request.user;
});