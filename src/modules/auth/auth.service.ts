import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmail, isMobilePhone } from 'class-validator';
import { randomInt } from 'crypto';
import type { Request, Response } from 'express';
import { Repository } from 'typeorm';

import { ECookieKeys } from 'src/common/enums/cookie.enum';
import {
  EAuthMessages,
  EBadRequestMessages,
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { checkOTPValidation } from 'src/common/utils/check-otp.util';
import { CookieOptions } from 'src/common/utils/cookie.util';

import { OTPEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { EAuthMethod } from './enums/method.enum';
import { EAuthType } from './enums/type.enum';
import { TokensService } from './tokens.service';
import type { TCookiePayload } from './types/payload.type';
import type { TAuthResponse } from './types/response.type';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>,
    @Inject(REQUEST) private request: Request,
    private tokensService: TokensService,
  ) {}

  async userExistence(authDto: AuthDto, res: Response) {
    const { type, method, username } = authDto;

    let result: TAuthResponse;
    switch (type) {
      case EAuthType.Login:
        result = await this.login(method, username);

        return this.sendResponseCookie(res, result);
      case EAuthType.Register:
        result = await this.register(method, username);

        return this.sendResponseCookie(res, result);
      default:
        throw new UnauthorizedException(EAuthMessages.InvalidMethod);
    }
  }
  async login(method: EAuthMethod, username: string) {
    const validatedUsername = this.validateUsername(method, username);
    const user = await this.checkUserExistence(method, validatedUsername);
    if (!user) throw new UnauthorizedException(EAuthMessages.UserNotFound);

    const otp = await this.saveOTP(user.id, method);

    const token = this.tokensService.generateToken(
      { userId: user.id },
      process.env.OTP_TOKEN_SECRET,
      60 * 2,
    );

    return {
      message: EPublicMessages.OTPSentSuccessfully,
      code: otp.code,
      token,
    };
  }
  async register(method: EAuthMethod, username: string) {
    const validatedUsername = this.validateUsername(method, username);
    let user = await this.checkUserExistence(method, validatedUsername);
    if (user) throw new ConflictException(EConflictMessages.UserAlreadyExists);
    if (method === EAuthMethod.Username) {
      throw new BadRequestException(EBadRequestMessages.RegisterUsernameExists);
    }

    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);

    const otp = await this.saveOTP(user.id, method);

    const token = this.tokensService.generateToken(
      { userId: user.id },
      process.env.OTP_TOKEN_SECRET,
      60 * 2,
    );

    return {
      message: EPublicMessages.OTPSentSuccessfully,
      code: otp.code,
      token,
    };
  }
  async saveOTP(userId: string, method: EAuthMethod) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    let isOtpExists = false;

    let otp = await this.otpRepository.findOneBy({
      userId,
    });
    if (otp) {
      isOtpExists = true;

      otp.code = code;
      otp.expiresIn = expiresIn;
      otp.method = method;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
        method,
      });
    }

    otp = await this.otpRepository.save(otp);

    if (!isOtpExists) {
      await this.userRepository.update(
        {
          id: userId,
        },
        {
          otpId: otp.id,
        },
      );
    }

    return otp;
  }
  async checkOTP(code: string) {
    const token = this.request.cookies?.[ECookieKeys.OTP];
    if (!token) throw new UnauthorizedException(EAuthMessages.CodeExpired);

    const { userId } = this.tokensService.verifyOTPToken<TCookiePayload>(
      token,
      process.env.OTP_TOKEN_SECRET,
    );

    const otp = await checkOTPValidation(this.otpRepository, userId, code);

    const accessToken = this.tokensService.generateToken(
      { userId },
      process.env.ACCESS_TOKEN_SECRET,
      '1y',
    );

    if (otp.method === EAuthMethod.Email) {
      await this.userRepository.update(
        { id: userId },
        {
          is_email_verified: true,
        },
      );
    } else if (otp.method === EAuthMethod.Phone) {
      await this.userRepository.update(
        { id: userId },
        {
          is_phone_verified: true,
        },
      );
    }

    return {
      message: EPublicMessages.LoggedInSuccessfully,
      accessToken,
    };
  }
  async checkUserExistence(method: EAuthMethod, username: string) {
    let user: UserEntity | UserEntity[] | null;
    user = await this.userRepository.find();

    switch (method) {
      case EAuthMethod.Email:
        user = await this.userRepository.findOneBy({ email: username });
        break;
      case EAuthMethod.Phone:
        user = await this.userRepository.findOneBy({ phone: username });
        break;
      case EAuthMethod.Username:
        user = await this.userRepository.findOneBy({ username });
        break;
    }

    return user;
  }
  async validateAccessToken(token: string) {
    const { userId } = this.tokensService.verifyOTPToken<TCookiePayload>(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      EAuthMessages.LoginAgain,
    );

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(EAuthMessages.LoginAgain);

    return user;
  }
  sendResponseCookie(res: Response, result: TAuthResponse) {
    const { code } = result;

    res.cookie(ECookieKeys.OTP, result.token, CookieOptions());

    return res.json({
      message: EPublicMessages.OTPSentSuccessfully,
      code,
    });
  }
  validateUsername(method: EAuthMethod, username: string) {
    switch (method) {
      case EAuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException(ENotFoundMessages.InvalidEmail);
      case EAuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException(ENotFoundMessages.InvalidPhone);
      case EAuthMethod.Username:
        if (String(username) && username.length < 50) return username;
        throw new BadRequestException(ENotFoundMessages.InvalidUsername);
    }
  }
}
