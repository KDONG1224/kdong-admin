import { RcFile } from 'antd/es/upload';

export interface BaseResponseProps {
  code: number;
  isSuccess: boolean;
  message: string | string[];
}

export interface AdditionalProps {
  [key: string]: any;
}

export interface PRcFile extends RcFile {
  sequence: number;
  originalname: string;
  mimetype: string;
  location: string;
  id: string | null;
}
