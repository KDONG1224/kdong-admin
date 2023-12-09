import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';

export class ArticleApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `http://localhost:24189/posts`
    }).create();
  }

  async getAllArticles() {
    return await this.Axios.get(``).then((res) => res.data);
  }

  async createArticle(data: any) {
    return await this.Axios.post<any>('', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  }

  async getArticleById(id: string) {
    return await this.Axios.get(`/${id}`).then((res) => res.data);
  }

  async updateArticleById(id: string, data: any) {
    return await this.Axios.patch(`/${id}`, data).then((res) => res.data);
  }
}
