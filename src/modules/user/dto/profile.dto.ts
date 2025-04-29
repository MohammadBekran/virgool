import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EGender } from '../enums/gender.enum';

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
