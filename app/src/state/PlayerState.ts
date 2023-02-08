import { atom } from 'jotai';

export const _PlayerDuration = atom<number>(0);
export const _PlayerElapsed = atom<number>(0);
export const _PlayerPlaying = atom<boolean>(false);
export const _PlayerUrl = atom<string | null>(null);
