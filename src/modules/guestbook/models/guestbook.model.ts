import { BaseResponseProps } from 'modules/common';

export interface CreateGuestbookProps {
  guestName: string;
  content: string;
  guestPassword: string;
}

export interface GuestbookImageProps {
  id: string;
  bucket: string;
  key: string;
  filename: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  sequence: number;
  folder: string;
  contentType: string;
}

export interface GuestbookListProps {
  id: string;
  guestName: string;
  content: string;
  expose: boolean;
  createdAt: string;
  updateAt: string;
  guestbookFiles: GuestbookImageProps[];
}

export interface UpdateExposeGuestbookProps {
  id: string;
  expose: boolean;
}

export interface ResponseGuestbookLists extends BaseResponseProps {
  result: {
    guestbooks: GuestbookListProps[];
    totalElements: number;
  };
}
