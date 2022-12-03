// Get system theme
export const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

import { atomWithStorage } from 'jotai/utils';

export const SettingsAtom = atomWithStorage('settings', { theme: darkMode ? 'dark' : 'light' });
