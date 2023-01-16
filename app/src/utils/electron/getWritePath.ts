import path from 'path';
import { SaveDialogOptions, SaveDialogReturnValue, ipcRenderer } from 'electron';
import { strict as assert } from 'node:assert';

const getHomeDir = (): Promise<string> => ipcRenderer.invoke('home-directory');
const writeFile = (options: SaveDialogOptions): Promise<SaveDialogReturnValue> =>
  ipcRenderer.invoke('write-file', options);

export interface WriteOptions {
  filePath?: string;
  shouldSaveAs?: boolean;
}

export const getWritePath = async (options: WriteOptions): Promise<string | undefined> => {
  const { filePath, shouldSaveAs = false } = options;
  const defaultPath = path.join(await getHomeDir(), 'Untitled.hyperaudio');

  try {
    const pathFromDialog = await writeFile({
      title: 'Save Hyperaudio file as…',
      defaultPath,
      properties: ['createDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Hyperaudio Files', extensions: ['hyperaudio'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    let newWritePath: string = '';

    if (shouldSaveAs || !filePath) {
      newWritePath = `${pathFromDialog.filePath}`;
    } else {
      newWritePath = filePath ?? defaultPath;
    }

    assert.notEqual(newWritePath, '');
    return newWritePath;
  } catch (error) {
    console.error(`getWritePath error: ${error}`);
  }
};
