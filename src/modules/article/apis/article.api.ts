import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';
import { ResponseArticleLists } from '../models/article.model';
import qs from 'qs';
import { AdditionalProps } from 'containers';

export class ArticleApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  async getAllArticles<T extends AdditionalProps>(query?: T) {
    const queryString = qs.stringify(query, { addQueryPrefix: true });

    return await this.Axios.get<ResponseArticleLists>(
      '/posts' + queryString
    ).then((res) => res.data);
  }

  async createArticle(data: any) {
    return await this.Axios.post<any>('/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  }

  async getArticleById(id: string) {
    return await this.Axios.get(`/posts/${id}`).then((res) => res.data);
  }

  async updateArticleById(id: string, data: any) {
    return await this.Axios.patch(`/posts/${id}`, data).then((res) => res.data);
  }

  async updateArticleExposeById(id: string) {
    return await this.Axios.post<ResponseArticleLists>(
      `/posts/expose/${id}`
    ).then((res) => res.data);
  }
}
