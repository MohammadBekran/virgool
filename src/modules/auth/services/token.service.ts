import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EAuthMessages } from 'src/common/enums/message.enum';
import type { TExceptionConstructor } from 'src/common/types/exception-constructor.type';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateToken<T extends object>(
    payload: T,
    secret: string,
    expiresIn: string | number,
  ) {
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    return token;
  }

  verifyOTPToken<T extends object>(
    token: string,
    secret: string,
    message: string = EAuthMessages.TryAgain,
    ExceptionClass: TExceptionConstructor = UnauthorizedException,
  ): T {
    try {
      const payload = this.jwtService.verify(token, {
        secret,
      });

      return payload;
    } catch (error) {
      throw new ExceptionClass(message);
    }
  }
}
