import { Color, PaletteMode } from '@mui/material';

// Get system theme
export const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

import { atomWithStorage } from 'jotai/utils';

export const settingsModeAtom = atomWithStorage<PaletteMode>('mode', darkMode ? 'dark' : 'light');
export const settingsColorAtom = atomWithStorage<Color | undefined>('color', undefined);
