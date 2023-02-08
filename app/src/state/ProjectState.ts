import { atomWithStorage } from 'jotai/utils';

export const _ProjectPath = atomWithStorage<string | null | undefined>('filePath', null);
