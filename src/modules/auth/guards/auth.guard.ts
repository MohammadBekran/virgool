import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import type { Request } from 'express';

import { EAuthMessages } from 'src/common/enums/message.enum';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.getUserToken(request);

    request.user = await this.authService.validateAccessToken(token);

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
