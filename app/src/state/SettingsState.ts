import { atomWithStorage } from 'jotai/utils';

import { Color, PaletteMode } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

// Get system theme
const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

export const SettingsModeAtom = atomWithStorage<PaletteMode>('mode', darkMode ? 'dark' : 'light');
export const SettingsColorAtom = atomWithStorage<Color>('color', deepPurple);
