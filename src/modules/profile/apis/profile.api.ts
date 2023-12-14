import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';

export class ProfileApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}/banners`
    }).create();
  }

  async getProfile() {
    return await this.Axios.get('/').then((res) => res.data);
  }

  async updateProfileBanners(id: string, data: FormData) {
    return await this.Axios.patch(`/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  }
}
