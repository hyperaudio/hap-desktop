import { atomWithStorage } from 'jotai/utils';

export const ProjectPathAtom = atomWithStorage<string | null | undefined>('filePath', null);
