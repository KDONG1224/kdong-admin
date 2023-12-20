export interface BaseResponseProps {
  code: number;
  isSuccess: boolean;
  message: string | string[];
}

export interface AdditionalProps {
  [key: string]: any;
}
