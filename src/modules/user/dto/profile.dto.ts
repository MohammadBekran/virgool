import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { EValidationMessages } from 'src/common/enums/message.enum';
import { ERole } from 'src/common/enums/role.enum';

import { EGender } from '../enums/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional()
  nick_name: string;
  @ApiPropertyOptional()
  biography: string;
  @ApiPropertyOptional()
  profile_image: string;
  @ApiPropertyOptional()
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

export class ChangeUsernameDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
}

export class BlockDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class AddOrRemoveRoleFromUser {
  @ApiProperty()
  @IsUUID()
  userId: string;
  @ApiProperty({ enum: ERole })
  role: ERole;
}
