import Cookies, { CookieAttributes, CookiesStatic } from 'js-cookie';

const CookieStorageBuilder = (cookies: CookiesStatic) => ({
  setCookie: (
    key: string,
    value: string | object,
    options?: CookieAttributes
  ) =>
    cookies.set(key, value as string, {
      path: '/',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'Lax',
      ...options
    }),
  getCookie: (key: string) => cookies.get(key),
  removeCookie: (key: string) => cookies.remove(key),
  clearAllCookies: () => {
    const all = cookies.get();

    Object.keys(all).forEach((key) => {
      cookies.remove(key);
    });
  }
});

export const cookieStorage = CookieStorageBuilder(Cookies);

const COOKIE_BASE_NAME = 'kdong';

export const COOKIE_ACCESS_TOKEN = `${COOKIE_BASE_NAME}_acst`;
export const COOKIE_REFRESH_TOKEN = `${COOKIE_BASE_NAME}_rfst`;
export const COOKIE_SAVE_ID = `${COOKIE_BASE_NAME}_saveid`;

export const COOKIE_IS_TUTORIAL_READ = 'tuto_read';
