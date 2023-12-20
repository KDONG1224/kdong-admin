export type UserRole = 'ADMIN' | 'CLIENT' | 'USER';

export interface RequestSignIn {
  userid: string;
  password: string;
  save: boolean;
}

export interface ResponseUserInfo {
  userid: string;
  username: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  status: boolean;
}

export interface ResponseSignIn {
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  userInfo: ResponseUserInfo;
}
