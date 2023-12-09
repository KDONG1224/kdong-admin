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
  birth: string;
  createdAt: string;
  updatedAt: string;
  role: 'ADMIN' | 'USER';
  status: boolean;
}

export interface ResponseSignIn {
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  userInfo: ResponseUserInfo;
}

export interface RequestSignUp
  extends Omit<
    ResponseUserInfo,
    'createdAt' | 'updatedAt' | 'role' | 'status'
  > {}
