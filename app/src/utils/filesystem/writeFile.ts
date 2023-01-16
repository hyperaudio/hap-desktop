import JSZip from 'jszip';
import { createWriteStream } from 'fs';

import { Project } from '@/models';

const zip = JSZip();

interface writeOptions {
  onComplete?: () => void;
  path: string;
}

export const writeFile = async (project: Project, options: writeOptions) => {
  const { onComplete, path } = options;
  const { metadata, transcripts, media } = project;

  const complete = () => {
    if (onComplete) onComplete();
  };

  try {
    // zip metadata
    zip.file('metadata.json', JSON.stringify(metadata));

    // zip media
    Object.keys(media).forEach(id => {
      const extension = media[id].name.split('.').pop();
      zip.file(`media/${id}.${extension}`, media[id].buffer);
    });

    // zip transcript
    zip.file(`transcript/${metadata.id}.json`, JSON.stringify(transcripts[0]));

    let timeout = setTimeout(complete, 5000);
    await zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true }, metadata => {
        clearTimeout(timeout);
        timeout = setTimeout(complete, 5000);
      })
      .pipe(createWriteStream(path));
  } catch (error) {
    console.error(`writeFile error: ${error}`);
  }
};
