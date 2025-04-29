import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';

import {
  MULTER_WHILE_LIST_FORMAT,
  TImageExtension,
} from '../constants/multer.constant';
import { EValidationMessages } from '../enums/message.enum';
import type {
  TMulterDestinationCallback,
  TMulterFile,
  TMulterFileNameCallback,
} from '../types/multer.type';
import { diskStorage } from 'multer';

export function multerDestination(folderName: string) {
  return function (
    req: Request,
    file: TMulterFile,
    callback: TMulterDestinationCallback,
  ) {
    const path = join('public', 'uploads', folderName);

    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function multerFileName(
  req: Request,
  file: TMulterFile,
  callback: TMulterFileNameCallback,
): void {
  const fileExtension = extname(file.originalname);

  if (!isValidImageFormat(fileExtension)) {
    callback(
      new BadRequestException(EValidationMessages.InvalidImageFormat),
      '',
    );
  } else {
    const filename = `${Date.now()}${fileExtension}`;
    callback(null, filename);
  }
}

export function multerStorage(folderName: string) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFileName,
  });
}

function isValidImageFormat(extension: string): extension is TImageExtension {
  return MULTER_WHILE_LIST_FORMAT.includes(extension as TImageExtension);
}
