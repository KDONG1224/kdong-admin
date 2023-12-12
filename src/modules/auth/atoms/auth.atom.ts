import { atom } from 'recoil';
import { userLoginStateProps } from '../models/auth.model';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userLoginState = atom<userLoginStateProps>({
  key: 'userLoginState',
  default: {
    userInfo: undefined,
    isLogin: false
  },
  effects_UNSTABLE: [persistAtom]
});
