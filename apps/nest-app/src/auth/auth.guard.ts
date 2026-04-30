import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from './current-user.interface';

type RequestWithUser = Request & { user: ICurrentUser };

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const currentUser: ICurrentUser = {
      id: 'default-user-1',
      name: 'default user 1',
      email: 'default-user-1@gmail.com',
    };

    request.user = currentUser;
    return true;
  }
}
