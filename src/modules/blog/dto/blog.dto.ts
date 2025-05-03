import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  title: string;
  @ApiPropertyOptional()
  slug: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  time_to_read: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  description: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  content: string;
  @ApiPropertyOptional()
  image: string;
}
