import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../common/types';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
