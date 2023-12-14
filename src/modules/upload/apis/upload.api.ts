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
    return await fetch(fileUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], fileName, { type: mimetype });

        return file;
      });
  }
};
