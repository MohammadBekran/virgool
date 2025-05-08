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

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ECookieKeys } from 'src/common/enums/cookie.enum';
import { EEntityName } from 'src/common/enums/entity.enum';
import {
  EAuthMessages,
  EBadRequestMessages,
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { checkOTPValidation } from 'src/common/utils/check-otp.util';
import { paginate, paginationData } from 'src/common/utils/pagination.util';

import { AuthService } from '../auth/services/auth.service';
import { EAuthMethod } from '../auth/enums/method.enum';
import { TokenService } from '../auth/services/token.service';
import { BlockDto, ProfileDto } from './dto/profile.dto';
import { FollowEntity } from './entities/follow.entity';
import { OTPEntity } from './entities/otp.entity';
import { ProfileEntity } from './entities/profile.entity';
import { UserEntity } from './entities/user.entity';
import { EGender } from './enums/gender.enum';
import type { TProfileImages } from './types/file.type';
import type {
  TEmailTokenPayload,
  TPhoneTokenPayload,
} from './types/payload.type';
import { EUserStatus } from './enums/status.enum';
import { TGoogleUser } from '../auth/types/response.type';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokensService: TokenService,
  ) {}

  async find(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginate(paginationDto);

    const [users, count] = await this.userRepository.findAndCount({
      where: {},
      relations: {
        profile: true,
        followers: {
          follower: {
            profile: true,
          },
        },
        followings: {
          following: {
            profile: true,
          },
        },
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        status: true,
        roles: true,
        created_at: true,
        profile: {
          id: true,
          nick_name: true,
          profile_image: true,
          background_image: true,
        },
        followers: {
          id: true,
          follower: {
            id: true,
            username: true,
            profile: {
              id: true,
              nick_name: true,
              profile_image: true,
              background_image: true,
            },
          },
        },
        followings: {
          id: true,
          following: {
            id: true,
            username: true,
            profile: {
              id: true,
              nick_name: true,
              profile_image: true,
              background_image: true,
            },
          },
        },
      },
      take: limit,
      skip,
      order: { created_at: 'DESC' },
    });

    return {
      pagination: paginationData(count, page, limit),
      users,
    };
  }

  async profile() {
    const { id } = this.request.user;

    const user = await this.userRepository
      .createQueryBuilder(EEntityName.User)
      .where({ id })
      .leftJoin('user.profile', 'profile')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.followings', 'user.followings')
      .getOne();

    return user;
  }

  async followers(paginationDto: PaginationDto) {
    const { id: userId } = this.request.user;
    const { page, limit, skip } = paginate(paginationDto);

    const [followers, count] = await this.followRepository.findAndCount({
      where: { followingId: userId },
      relations: {
        follower: {
          profile: true,
        },
      },
      select: {
        follower: {
          id: true,
          username: true,
          profile: {
            id: true,
            nick_name: true,
            biography: true,
            profile_image: true,
            background_image: true,
          },
        },
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      pagination: paginationData(count, page, limit),
      followers,
    };
  }

  async followings(paginationDto: PaginationDto) {
    const { id: userId } = this.request.user;
    const { page, limit, skip } = paginate(paginationDto);

    const [followings, count] = await this.followRepository.findAndCount({
      where: { followerId: userId },
      relations: {
        following: {
          profile: true,
        },
      },
      select: {
        following: {
          id: true,
          username: true,
          profile: {
            id: true,
            nick_name: true,
            biography: true,
            profile_image: true,
            background_image: true,
          },
        },
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      pagination: paginationData(count, page, limit),
      followings,
    };
  }

  async toggleFollow(followingId: string) {
    const { id: userId } = this.request.user;

    if (userId === followingId) {
      throw new BadRequestException(EBadRequestMessages.CannotFollowYourself);
    }

    const followingUser = await this.userRepository.findOneBy({
      id: followingId,
    });
    if (!followingUser) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    const isFollowing = await this.followRepository.findOneBy({
      followerId: userId,
      followingId,
    });

    if (isFollowing) {
      await this.followRepository.remove(isFollowing);
    } else {
      await this.followRepository.insert({
        followingId,
        followerId: userId,
      });
    }

    return {
      message: isFollowing
        ? EPublicMessages.UserUnFollowed
        : EPublicMessages.UserFollowed,
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

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;

    const token = this.request.cookies?.[ECookieKeys.PhoneOTP];
    if (!token) throw new BadRequestException(EAuthMessages.CodeExpired);

    const { phone } = this.tokensService.verifyOTPToken<TPhoneTokenPayload>(
      token,
      process.env.PHONE_TOKEN_SECRET,
      EAuthMessages.TryAgain,
      BadRequestException,
    );
    if (phone !== new_phone) {
      throw new BadRequestException(EBadRequestMessages.SomethingWentWrong);
    }

    const otp = await checkOTPValidation(
      this.otpRepository,
      userId,
      code,
      BadRequestException,
    );
    if (otp?.method !== EAuthMethod.Phone) {
      throw new BadRequestException(EBadRequestMessages.SomethingWentWrong);
    }

    await this.userRepository.update(
      { id: userId },
      { phone, is_phone_verified: true, new_phone: null },
    );

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async toggleBlock(blockDto: BlockDto) {
    const { userId } = blockDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    const isBlocked = user.status === EUserStatus.Block;

    if (isBlocked) {
      await this.userRepository.update(
        { id: userId },
        { status: EUserStatus.Active },
      );
    } else {
      await this.userRepository.update(
        { id: userId },
        { status: EUserStatus.Block },
      );
    }

    return {
      message: isBlocked
        ? EPublicMessages.UserUnBlocked
        : EPublicMessages.UserBlocked,
    };
  }

  async updateProfile(profileDto: ProfileDto, files: TProfileImages) {
    const { id: userId, profileId } = this.request.user;

    if (files?.profile_image?.length > 0) {
      const [image] = files.profile_image;

      profileDto.profile_image = image?.path?.slice(7);
    }
    if (files?.background_image?.length > 0) {
      const [image] = files.background_image;

      profileDto.background_image = image?.path?.slice(7);
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

  async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ phone });

    if (user && user.id !== id) {
      throw new ConflictException(EConflictMessages.PhoneUsed);
    } else if (user && user.id === id) {
      return {
        message: EPublicMessages.UpdatedSuccessfully,
      };
    }

    await this.userRepository.update({ id }, { new_phone: phone });

    const otp = await this.authService.saveOTP(id, EAuthMethod.Email);
    const token = this.tokensService.generateToken<TPhoneTokenPayload>(
      { phone },
      process.env.PHONE_TOKEN_SECRET,
      60 * 2,
    );

    return {
      code: otp.code,
      token,
    };
  }

  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });

    if (user && user.id !== id) {
      throw new ConflictException(EConflictMessages.UsernameUsed);
    } else if (user && user.id === id) {
      return {
        message: EPublicMessages.UpdatedSuccessfully,
      };
    }

    await this.userRepository.update({ id }, { username });

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async googleLogin(googleUser: TGoogleUser) {
    const { email, firstName, lastName, id } = googleUser;

    let user = await this.userRepository.findOneBy({ email });
    let accessToken: string;

    if (user) {
      accessToken = this.tokensService.generateToken(
        {
          userId: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        '1y',
      );
    } else {
      user = this.userRepository.create({
        email,
        username: `g_${id}`,
        is_email_verified: true,
      });
      await this.userRepository.save(user);
      let profile = this.profileRepository.create({
        userId: user.id,
        nick_name: `${firstName} ${lastName}`,
      });
      profile = await this.profileRepository.save(profile);
      user.profileId = profile.id;
      await this.userRepository.save(user);

      accessToken = this.tokensService.generateToken(
        {
          userId: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        '1y',
      );
    }

    return {
      message: EPublicMessages.LoggedInSuccessfully,
      accessToken,
    };
  }
}
