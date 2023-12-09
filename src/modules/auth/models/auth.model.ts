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
  role: 'ADMIN' | 'USER';
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
