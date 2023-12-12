import { atom } from 'recoil';

export const loadingState = atom({
  key: 'loadingState',
  default: false
});

export const collapsedState = atom({
  key: 'collapsedState',
  default: false
});
