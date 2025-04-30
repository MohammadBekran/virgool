import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMobilePhone } from 'class-validator';

import { EGender } from '../enums/gender.enum';
import { EValidationMessages } from 'src/common/enums/message.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  nick_name: string;
  @ApiPropertyOptional()
  biography: string;
  @ApiPropertyOptional({ format: 'binary' })
  profile_image: string;
  @ApiPropertyOptional({ format: 'binary' })
  background_image: string;
  @ApiPropertyOptional({ enum: EGender })
  @IsEnum(EGender)
  gender: string;
  @ApiPropertyOptional({ example: '2025-04-29T15:24:46.428Z' })
  birthday: Date;
  @ApiPropertyOptional()
  linkedin_profile: string;
  @ApiPropertyOptional()
  x_profile: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: EValidationMessages.InvalidEmail })
  email: string;
}

export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: EValidationMessages.InvalidPhone })
  phone: string;
}
