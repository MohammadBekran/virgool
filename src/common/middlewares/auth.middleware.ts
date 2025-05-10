import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { isJWT } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OptionalAuthMiddleware.name);

  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.getUserToken(req);
    if (!token) return next();

    try {
      let user = await this.authService.validateAccessToken(token);
      if (user) req.user = user;
    } catch (error) {
      this.logger.warn(
        `Invalid JWT in OptionalAuthMiddleware: ${error.message}`,
      );
    } finally {
      next();
    }
  }

  protected getUserToken(request: Request) {
    const { authorization } = request.headers;

    if (!authorization?.trim()) {
      return null;
    }
    const [bearer, token] = authorization?.split(' ');
    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      return null;
    }

    return token;
  }
}
