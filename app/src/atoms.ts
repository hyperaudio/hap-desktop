import { atomWithStorage } from 'jotai/utils';

export const countAtom = atomWithStorage('counter', 0);
