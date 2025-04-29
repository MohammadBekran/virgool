export type TMulterDestinationCallback = (
  error: Error | null,
  destination: string,
) => void;
export type TMulterFileNameCallback = (
  error: Error | null,
  fileName: string,
) => void;
export type TMulterFile = Express.Multer.File;
