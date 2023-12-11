import AxiosInstanceCreator from 'services/api';
import { UserAccount } from '../models/auth.model';

export const authInstance = new AxiosInstanceCreator({
  baseURL: `${process.env.REACT_APP_API_URL}/auth`
}).create();

export const authApi = {
  usersLogin: async (data: UserAccount) =>
    await authInstance.post<any>('/login', data).then((res) => res.data),
  userSignUp: async (data: UserAccount) =>
    await authInstance.post<any>('/signup', data).then((res) => res.data)
};
