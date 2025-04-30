import { HttpException } from '@nestjs/common';

export type TExceptionConstructor = new (
  message: string | object,
  description?: string,
) => HttpException;
