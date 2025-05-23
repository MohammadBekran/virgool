import { FileInterceptor } from '@nestjs/platform-express';

import { multerStorage } from '../utils/multer.util';

export function UploadFileInterceptor(
  fieldName: string,
  folderName: string = 'images',
) {
  return class UploadFileUtility extends FileInterceptor(fieldName, {
    storage: multerStorage(folderName),
  }) {};
}
