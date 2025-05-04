import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsUUID()
  blogId: string;
  @ApiProperty()
  @Length(5)
  content: string;
  @ApiPropertyOptional()
  @IsOptional()
  parentId: string;
}
