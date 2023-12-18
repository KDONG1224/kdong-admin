import AxiosInstanceCreator from 'services/api';
import { UserAccount } from '../models/auth.model';
import { AxiosInstance } from 'axios';

export class AuthApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  async usersLogin(data: UserAccount) {
    return await this.Axios.post<any>('/auth/login', data).then(
      (res) => res.data
    );
  }

  async userSignUp(data: UserAccount) {
    return await this.Axios.post<any>('/auth/signup', data).then(
      (res) => res.data
    );
  }
}
