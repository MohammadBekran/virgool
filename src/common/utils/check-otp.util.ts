import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OTPEntity } from 'src/modules/user/entities/otp.entity';

import { EAuthMessages } from '../enums/message.enum';
import type { TExceptionConstructor } from '../types/exception-constructor.type';

export async function checkOTPValidation(
  otpRepository: Repository<OTPEntity>,
  userId: string,
  code: string,
  ExceptionClass: TExceptionConstructor = UnauthorizedException,
) {
  const otp = await otpRepository.findOneBy({ userId });
  if (!otp) throw new ExceptionClass(EAuthMessages.LoginAgain);

  const now = new Date();
  if (otp.expiresIn < now) {
    throw new ExceptionClass(EAuthMessages.CodeExpired);
  }
  if (otp.code !== code) {
    throw new ExceptionClass(EAuthMessages.TryAgain);
  }

  return otp;
}
