import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';
import qs from 'qs';
import { AdditionalProps } from 'containers';
import { UpdateExposeGuestbookProps } from '../models/guestbook.model';

export class GuestbookApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  async getGuestbookList<T extends AdditionalProps>(query?: T) {
    const queryString = qs.stringify(
      {
        ...query
      },
      { addQueryPrefix: true }
    );

    return await this.Axios.get<any>('/guestbooks' + queryString).then(
      (res) => res.data
    );
  }

  async updateGuestbookExpose(data: UpdateExposeGuestbookProps) {
    return await this.Axios.post<any>(`/guestbooks/expose/${data.id}`, {
      expose: data.expose
    }).then((res) => res.data);
  }
}
