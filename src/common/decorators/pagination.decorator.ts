import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Pagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', type: 'integer', required: false, example: 1 }),
    ApiQuery({ name: 'limit', type: 'integer', required: false, example: 10 }),
  );
}
