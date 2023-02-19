import { atom } from 'jotai';

export const PlayerDurationAtom = atom<number>(0);
export const PlayerElapsedAtom = atom<number>(0);
export const PlayerPinAtom = atom<boolean>(true);
export const PlayerPlayingAtom = atom<boolean>(false);
export const PlayerRateAtom = atom<number>(1);
export const PlayerUrlAtom = atom<string | null>(null);
export const PlayerVolumeAtom = atom<number>(1);
