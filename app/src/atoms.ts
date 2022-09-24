// Get system theme
export const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

import { atomWithStorage } from 'jotai/utils';

export const countAtom = atomWithStorage('counter', 0);
export const themeAtom = atomWithStorage('theme', darkMode ? 'dark' : 'light');
