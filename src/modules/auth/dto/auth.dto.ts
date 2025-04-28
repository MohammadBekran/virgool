import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { EAuthType } from '../enums/type.enum';
import { EAuthMethod } from '../enums/method.enum';

export class AuthDto {
  @ApiProperty({ enum: EAuthType })
  @IsEnum(EAuthType)
  type: EAuthType;
  @ApiProperty({ enum: EAuthMethod })
  @IsEnum(EAuthMethod)
  method: EAuthMethod;
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
}

export class OTPDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  code: string;
}
