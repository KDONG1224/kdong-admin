import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';

export class GuestbookApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  async getGuestbookList() {
    return await this.Axios.get<any>('/guestbook').then((res) => res.data);
  }

  async updateGuestbookExpose(data: any) {
    return await this.Axios.patch<any>('/guestbook/expose', data).then(
      (res) => res.data
    );
  }
}
