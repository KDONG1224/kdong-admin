import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';
import { RequestProfileFaqFormProps } from '../models/profile.model';

export class ProfileApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  /**
   * Banners
   */
  async getProfileBanners() {
    return await this.Axios.get('/banners').then((res) => res.data);
  }

  async updateProfileBanners(id: string, data: FormData) {
    return await this.Axios.patch(`/banners/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  }

  /**
   * FAQs
   */
  async getProfileFaq() {
    return await this.Axios.get('/faqs').then((res) => res.data);
  }

  async createProfileFaq(data: RequestProfileFaqFormProps) {
    return await this.Axios.post('/faqs', data).then((res) => res.data);
  }

  async updateProfileFaq(id: string, data: RequestProfileFaqFormProps) {
    return await this.Axios.patch(`/faqs/${id}`, data).then((res) => res.data);
  }

  async updateExposeProfileFaq(id: string) {
    return await this.Axios.patch(`/faqs/expose/${id}`).then((res) => res.data);
  }
}
