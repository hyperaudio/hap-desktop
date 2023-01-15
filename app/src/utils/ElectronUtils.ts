import JSZip from 'jszip';
import path from 'path';
import { SaveDialogOptions, SaveDialogReturnValue, ipcRenderer } from 'electron';
import { createWriteStream } from 'fs';
import { strict as assert } from 'node:assert';

interface Project {
  media: any; // TODO: Typecheck
  metadata: any; // TODO: Typecheck
  transcript: any; // TODO: Typecheck
}

interface handleSaveOptions {
  filePath?: string;
  onChangeFilePath: (path: string) => void;
  onError?: (error: Error) => void;
  onSaveExit: () => void;
  onSaveStart: () => void;
  shouldSaveAs?: boolean;
}

const getHomeDir = (): Promise<string> => ipcRenderer.invoke('home-directory');
const writeFile = (options: SaveDialogOptions): Promise<SaveDialogReturnValue> =>
  ipcRenderer.invoke('write-file', options);

export const handleFileSave = async (payload: Project, options: handleSaveOptions) => {
  const { shouldSaveAs = false, onError, onChangeFilePath, onSaveStart, onSaveExit, filePath } = options;
  const { metadata, media, transcript } = payload;
  const { speakers, blocks } = transcript;

  console.group('handleFileSave');
  console.log({ options });
  console.log({ payload });
  console.groupEnd();

  onSaveStart();

  try {
    const defaultPath = path.join(await getHomeDir(), 'Untitled.hyperaudio');

    const awaitWriteFile = await writeFile({
      title: 'Save Hyperaudio file as…',
      defaultPath,
      properties: ['createDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Hyperaudio Files', extensions: ['hyperaudio'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    const writeFilePath =
      shouldSaveAs || !filePath ? (await awaitWriteFile.filePath) ?? defaultPath : filePath ?? defaultPath;

    assert.notEqual(writeFilePath, '');
    onChangeFilePath(writeFilePath);

    const zip = JSZip();
    zip.file('metadata.json', JSON.stringify(metadata));
    zip.file(`transcript/${metadata.id}.json`, JSON.stringify({ speakers, blocks: blocks ?? [] }));
    Object.keys(media).forEach(id => {
      // FIXME: it writes media files without extensions
      zip.file(`media/${id}`, media[id].buffer);
    });

    let timeout = setTimeout(onSaveExit, 5000);
    await zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true }, metadata => {
        clearTimeout(timeout);
        timeout = setTimeout(onSaveExit, 5000);
      })
      .pipe(createWriteStream(writeFilePath));
  } catch (error) {
    if (onError) onError(error as Error);
    onSaveExit();
  }
  onSaveExit();
};

export const handleOpen = async () => {};

export const ElectronUtils = {
  handleFileSave,
  handleOpen,
};
