export const MULTER_WHILE_LIST_FORMAT = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
] as const;

export type TImageExtension = (typeof MULTER_WHILE_LIST_FORMAT)[number];
