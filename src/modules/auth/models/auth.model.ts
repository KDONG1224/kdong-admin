import { BaseResponseProps } from 'modules/common';
import { UserRole } from 'modules/user';

export interface UserAccount {
  userid: string;
  password: string;
}

export interface UserInfoProps {
  id: string;
  username: string;
  birthday: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface userLoginStateProps {
  userInfo: UserInfoProps | undefined;
  isLogin: boolean;
}

export interface ForgotPasswordProps {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RequestSignUp {
  userid: string;
  password: string;
  username: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}

export interface ResponseSignUp extends BaseResponseProps {
  result: UserInfoProps;
}
