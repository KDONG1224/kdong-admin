import { atom } from 'recoil';
import { userLoginStateProps } from '../models/auth.model';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userLoginState = atom<userLoginStateProps | undefined>({
  key: 'userLoginState',
  default: undefined,
  effects_UNSTABLE: [persistAtom]
});
