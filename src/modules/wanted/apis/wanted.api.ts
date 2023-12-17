import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';
import { ResponseWantedProps, SendMailerProps } from '../models/wanted.model';

export class WantedApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  async getAllWanted() {
    return await this.Axios.get<ResponseWantedProps>('/mailer').then(
      (res) => res.data
    );
  }

  async sendMailer(data: SendMailerProps) {
    return await this.Axios.post('/mailer/send', data).then((res) => res.data);
  }
}
