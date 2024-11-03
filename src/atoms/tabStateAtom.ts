import { atom } from 'jotai';

export const tabStateAtom = atom([
  { id: 'WATCHING', value: 'delivered' },
  { id: 'WANNA_WATCH', value: 'delivered' },
  { id: 'WATCHED', value: 'delivered' },
  { id: 'ON_HOLD', value: 'delivered' },
  { id: 'STOP_WATCHING', value: 'delivered' }
]);