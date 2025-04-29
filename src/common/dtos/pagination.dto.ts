import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ type: 'integer' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiPropertyOptional({ type: 'integer' })
  limit?: number;
}
