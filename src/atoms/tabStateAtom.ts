import { atom } from 'recoil';

export const tabStateAtom = atom({
  key: 'tabState',
  default: [
    { id: 'WATCHING', value: 'delivered' },
    { id: 'WANNA_WATCH', value: 'delivered' },
    { id: 'WATCHED', value: 'delivered' },
    { id: 'ON_HOLD', value: 'delivered' },
    { id: 'STOP_WATCHING', value: 'delivered' }
  ],
});