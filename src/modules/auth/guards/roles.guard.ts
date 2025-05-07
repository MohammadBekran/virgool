import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { EForbiddenMessages } from 'src/common/enums/message.enum';
import { ERole } from 'src/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<Request>();

    const hasAccess = requiredRoles.some((role) => user?.roles?.includes(role));
    if (!hasAccess) {
      throw new ForbiddenException(EForbiddenMessages.AccessDenied);
    }

    return true;
  }
}
