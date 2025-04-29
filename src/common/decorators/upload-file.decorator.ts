import { ParseFilePipe, UploadedFiles } from '@nestjs/common';

export function UploadFile(fileIsRequired: boolean = false) {
  return UploadedFiles(
    new ParseFilePipe({
      fileIsRequired,
    }),
  );
}
