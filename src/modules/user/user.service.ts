import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate } from 'class-validator';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import {
  EAuthMessages,
  EBadRequestMessages,
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';

import { ECookieKeys } from 'src/common/enums/cookie.enum';
import { checkOTPValidation } from 'src/common/utils/check-otp.util';
import { AuthService } from '../auth/auth.service';
import { TokensService } from '../auth/tokens.service';
import { ProfileDto } from './dto/profile.dto';
import { OTPEntity } from './entities/otp.entity';
import { ProfileEntity } from './entities/profile.entity';
import { UserEntity } from './entities/user.entity';
import { EGender } from './enums/gender.enum';
import type { TProfileImages } from './types/file.type';
import type { TEmailTokenPayload } from './types/payload.type';
import { EAuthMethod } from '../auth/enums/method.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokensService: TokensService,
  ) {}

  async updateProfile(profileDto: ProfileDto, files: TProfileImages) {
    const { id: userId, profileId } = this.request.user;

    if (files?.profile_image?.length > 0) {
      const [image] = files.profile_image;

      profileDto.profile_image = `${process.env.URL}/${image.path.slice(7).replaceAll('\\', '/')}`;
    }
    if (files?.background_image?.length > 0) {
      const [image] = files.background_image;

      profileDto.background_image = `${process.env.URL}/${image.path.slice(7).replaceAll('\\', '/')}`;
    }

    const {
      nick_name,
      gender,
      biography,
      birthday,
      linkedin_profile,
      x_profile,
      background_image,
      profile_image,
    } = profileDto;

    let profile = await this.profileRepository.findOneBy({
      userId,
    });
    if (profile) {
      if (nick_name) profile.nick_name = nick_name;
      if (gender && Object.values(EGender).includes(gender as EGender))
        profile.gender = gender;
      if (biography) profile.biography = biography;
      if (birthday && isDate(birthday)) profile.birthday = birthday;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (profile_image) profile.profile_image = profile_image;
      if (background_image) profile.background_image = background_image;
    } else {
      profile = this.profileRepository.create({
        nick_name,
        gender,
        biography,
        birthday,
        linkedin_profile,
        x_profile,
        background_image,
        profile_image,
        userId,
      });
    }

    await this.profileRepository.save(profile);

    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id },
      );
    }

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async profile() {
    const { id } = this.request.user;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    return user;
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });

    if (user && user.id !== id) {
      throw new ConflictException(EConflictMessages.EmailUsed);
    } else if (user && user.id === id) {
      return {
        message: EPublicMessages.UpdatedSuccessfully,
      };
    }

    await this.userRepository.update({ id }, { new_email: email });

    const otp = await this.authService.saveOTP(id, EAuthMethod.Email);
    const token = this.tokensService.generateToken<TEmailTokenPayload>(
      { email },
      process.env.EMAIL_TOKEN_SECRET,
      60 * 2,
    );

    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;

    const token = this.request.cookies?.[ECookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(EAuthMessages.CodeExpired);

    const { email } = this.tokensService.verifyOTPToken<TEmailTokenPayload>(
      token,
      process.env.EMAIL_TOKEN_SECRET,
      EAuthMessages.TryAgain,
      BadRequestException,
    );
    if (email !== new_email) {
      throw new BadRequestException(EBadRequestMessages.SomethingWentWrong);
    }

    const otp = await checkOTPValidation(
      this.otpRepository,
      userId,
      code,
      BadRequestException,
    );
    if (otp?.method !== EAuthMethod.Email) {
      throw new BadRequestException(EBadRequestMessages.SomethingWentWrong);
    }

    await this.userRepository.update(
      { id: userId },
      { email, is_email_verified: true, new_email: null },
    );

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }
}
