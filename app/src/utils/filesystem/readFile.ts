import JSZip from 'jszip';
import { readFileSync } from 'fs';

import { Transcript } from '@/models';

interface Media {
  buffer: any;
  id: string;
  name: string;
  url: string;
}

export interface ExistingProject {
  media: Media[];
  metadata: any;
  transcripts: Array<{ name: string; data: Transcript }>;
}

export const readFile = async (path: string): Promise<ExistingProject | undefined> => {
  const zip = await JSZip.loadAsync(readFileSync(path));

  try {
    const media: Media[] = await Promise.all(
      zip.file(/^media\//).map(async file => ({
        id: file.name.split('/').pop()?.split('.').reverse().pop() as string,
        name: file.name,
        buffer: await file.async('arraybuffer'),
        url: URL.createObjectURL(await file.async('blob')),
      })),
    );

    const metadata = JSON.parse((await zip?.file('metadata.json')?.async('text')) ?? '{}');

    const transcripts = await Promise.all(
      zip.file(/^transcript\//).map(async file => ({
        name: file.name,
        data: JSON.parse((await file.async('text')) ?? '{}'),
      })),
    );

    return {
      media,
      metadata,
      transcripts,
    };
  } catch (error) {
    console.error(`readFile error: ${error}`);
    return;
  }
};
