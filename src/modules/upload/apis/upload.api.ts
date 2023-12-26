import { AxiosInstance } from 'axios';
import AxiosInstanceCreator from 'services/api';

export const uploadInstance = new AxiosInstanceCreator({
  baseURL: `${process.env.REACT_APP_API_URL}/common`
}).create();

export const uploadApi = {
  postUploadFile: async (formData: FormData) =>
    await uploadInstance
      .post<any>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res.data),
  getS3Object: async (fileUrl: string, fileName: string, mimetype: string) => {
    return await fetch(fileUrl, {
      mode: 'cors'
    })
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], fileName, { type: mimetype });

        return file;
      });
  }
};

export class UploadApi {
  Axios: AxiosInstance;

  constructor() {
    this.Axios = new AxiosInstanceCreator({
      baseURL: `${process.env.REACT_APP_API_URL}`
    }).create();
  }

  async postUploadFile(formData: FormData) {
    return await this.Axios.post<any>('/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => res.data);
  }

  async getFileObject(fileKey: string) {
    return await this.Axios.get<any>(`/aws/object/${fileKey}`).then(
      (res) => res.data.result.data
    );
  }

  async getS3Object(fileUrl: string, fileName: string, mimetype: string) {
    return await fetch(fileUrl, {
      mode: 'cors'
    })
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], fileName, { type: mimetype });

        return file;
      });
  }
}
