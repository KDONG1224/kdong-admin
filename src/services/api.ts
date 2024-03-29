// base
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { cookieStorage, COOKIE_ACCESS_TOKEN } from './cookie';
import { ROUTE_SIGN_IN } from 'routes/const';

const source = axios.CancelToken.source();

export const clearUserToken = () => {
  cookieStorage.removeCookie(COOKIE_ACCESS_TOKEN);
  window.location.href = ROUTE_SIGN_IN;
};

class AxiosInstanceCreator {
  #instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.#instance = axios.create(config);

    this.#instance.defaults.cancelToken = source.token;
    // this.#instance.defaults.paramsSerializer = (params = {}) => {
    //   console.log('=== params ===', params);

    //   if (params.filter) {
    //     params.filter = `${encodeURIComponent(JSON.stringify(params.filter))}`;
    //   }

    //   if (params.where) {
    //     params.where = `${encodeURIComponent(JSON.stringify(params.where))}`;
    //   }

    //   return qs.stringify(params, { encode: false });
    // };

    this.interceptors();
  }

  interceptors() {
    this.#instance.interceptors.request.use((config) => {
      const token = cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);

      if (!config.headers['Authorization']) {
        if (token) {
          Object.assign(config.headers, {
            Authorization: `Bearer ${token}`
          });
        }
      }

      if (!config.headers['Content-Type']) {
        Object.assign(config.headers, {
          'Content-Type': 'application/json'
        });
      }

      return config;
    });

    this.#instance.interceptors.response.use(
      (res) => {
        const token = cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);

        // if (res.data.code) {
        //   throw new Error(res.data.message).message;
        // }

        return res;
      },
      (error) => {
        if (error.response.data.message.includes('토큰')) {
          clearUserToken();
        }

        throw error.response.data;
      }
    );
  }

  create() {
    return this.#instance;
  }
}

export default AxiosInstanceCreator;
