import AxiosInstanceCreator from 'services/api';

export const userInstance = new AxiosInstanceCreator({
  baseURL: `http://localhost:24189/users`
}).create();

export const userApi = {
  getAllUsers: async () =>
    await userInstance.get<any>('').then((res) => res.data),
    getUserInfo: async (id: string) =>
    await userInstance.get<any>(`/${id}`).then((res) => res.data),
};
