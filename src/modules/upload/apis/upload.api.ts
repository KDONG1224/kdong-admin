import AxiosInstanceCreator from 'services/api';

export const uploadInstance = new AxiosInstanceCreator({
  baseURL: `http://localhost:24189/common`
}).create();

export const uploadApi = {
  postUploadFile: async (formData: FormData) =>
    await uploadInstance
      .post<any>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res.data)
};
