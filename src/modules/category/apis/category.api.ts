import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';
import {
  CreateCategoryProps,
  ResponseSubCategoryLists,
  UpdateCategoryProps
} from '../models/category.model';

export class CategoryApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}/categories`
    }).create();
  }

  async getMainCategories() {
    return await this.Axios.get(`/main`).then((res) => res.data);
  }

  async getAllSubCategories() {
    return await this.Axios.get<ResponseSubCategoryLists>(`/sub`).then(
      (res) => res.data
    );
  }

  async getSubCategories(id: string) {
    return await this.Axios.get(`/sub/${id}`).then((res) => res.data);
  }

  async createCategory(data: CreateCategoryProps) {
    return await this.Axios.post<any>('', data).then((res) => res.data);
  }

  async updateCategory(id: string, data: UpdateCategoryProps) {
    return await this.Axios.patch(`/${id}`, data).then((res) => res.data);
  }
}
