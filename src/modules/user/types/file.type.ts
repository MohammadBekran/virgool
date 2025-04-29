import type { TMulterFile } from 'src/common/types/multer.type';

export type TProfileImages = {
  profile_image: TMulterFile[];
  background_image: TMulterFile[];
};
