import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Color, PaletteMode } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

// Get system theme
export const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

export const settingsModeAtom = atomWithStorage<PaletteMode>('mode', darkMode ? 'dark' : 'light');
export const settingsColorAtom = atomWithStorage<Color>('color', deepPurple);
export const filePathAtom = atomWithStorage<string | null | undefined>('filePath', null);

export const serverInfoAtom = atom<any[]>([]);
