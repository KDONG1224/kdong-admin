import { BaseResponseProps } from 'modules/common';

export interface BannerImageProps {
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

export interface BannerTitleProps {
  title: string;
  playSpeed: number;
  sequence: number;
}

export interface BannerListsProps {
  id: string;
  autoPlay: boolean;
  playSpeed: number;
  createdAt: string;
  updatedAt: string;
  bannerImages: BannerImageProps[];
  bannerTitles: BannerTitleProps[];
}

export interface ResponseProfileProps extends BaseResponseProps {
  result: {
    bannerLists: BannerListsProps[];
  };
}

export interface RequestProfileBannerUpdate {
  bannerTitles: string;
  playSpeed: string & number & Blob;
  autoPlay: boolean & string & Blob;
}
