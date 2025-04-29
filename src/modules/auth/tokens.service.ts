import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EAuthMessages } from 'src/common/enums/message.enum';

import type { TCookiePayload } from './types/payload.type';

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  generateToken(
    payload: TCookiePayload,
    secret: string,
    expiresIn: string | number,
  ) {
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    return token;
  }
  verifyOTPToken(
    token: string,
    secret: string,
    message: string = EAuthMessages.TryAgain,
  ): TCookiePayload {
    try {
      const payload = this.jwtService.verify(token, {
        secret,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException(message);
    }
  }
}
