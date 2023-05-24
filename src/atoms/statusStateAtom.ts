import { atom } from 'recoil';

export const statusStateAtom = atom({
  key: 'statusState',
  default: 'WATCHING',
});