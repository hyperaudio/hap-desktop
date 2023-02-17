import { atomWithStorage } from 'jotai/utils';

import { Color, PaletteMode } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

// Get system theme
const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

export const _SettingsMode = atomWithStorage<PaletteMode>('mode', darkMode ? 'dark' : 'light');

export const _SettingsColor = atomWithStorage<Color>('color', deepPurple);
