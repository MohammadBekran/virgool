import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isJWT } from 'class-validator';
import type { Request } from 'express';

import { SKIP_AUTH } from 'src/common/decorators/skip-auth.decorator';
import {
  EAuthMessages,
  EForbiddenMessages,
} from 'src/common/enums/message.enum';
import { EUserStatus } from 'src/modules/user/enums/status.enum';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isSkippedAuthorization = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler(),
    );
    if (isSkippedAuthorization) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.getUserToken(request);

    request.user = await this.authService.validateAccessToken(token);
    if (request?.user?.status === EUserStatus.Block) {
      throw new ForbiddenException(EForbiddenMessages.Blocked);
    }

    return true;
  }

  protected getUserToken(request: Request) {
    const { authorization } = request.headers;

    if (!authorization?.trim()) {
      throw new UnauthorizedException(EAuthMessages.Login);
    }
    const [bearer, token] = authorization?.split(' ');
    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException(EAuthMessages.Login);
    }

    return token;
  }
}
