import { extname } from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { UnsupportedMediaTypeException } from '@nestjs/common';

export const imageTypeFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

  const fileExtension = extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    callback(null, true);
  } else {
    callback(new UnsupportedMediaTypeException('Only image files are allowed'));
  }
};

export const fileTypeFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const allowedExtensions = [
    '.jpg',
    '.png',
    '.dicom',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.pdf',
    '.ppt',
    '.pptx',
    '.pps',
    '.ppsx',
    '.tif',
    '.tiff',
    '.txt',
    '.odt',
    '.rtf',
    '.dcm',
    '.mp4',
  ];

  const fileExtension = extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    callback(null, true);
  } else {
    callback(new UnsupportedMediaTypeException('Only valid files are allowed'));
  }
};

const SUPPORTED_TYPES = [
  //image types
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',

  //document types
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  'application/rtf',
  'text/plain',
  'application/vnd.oasis.opendocument.text',
  'application/postscript',
  'application/dicom',

  //Media format
  'audio/mpeg',
  'audio/mpeg3',
  'audio/x-mpeg-3',
  'video/mpeg',
  'video/x-mpeg',
  'video/mp4',
  'application/mp4',
];
