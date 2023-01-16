import { OpenDialogOptions, OpenDialogReturnValue, ipcRenderer } from 'electron';

const openFile = (options: OpenDialogOptions): Promise<OpenDialogReturnValue> =>
  ipcRenderer.invoke('open-file', options);

export const getReadPath = async (): Promise<string | undefined> => {
  try {
    const {
      filePaths: [readFilePath],
    } = await openFile({
      title: 'Open Hyperaudio file…',
      properties: ['openFile', 'promptToCreate', 'createDirectory'],
      filters: [
        { name: 'Hyperaudio Files', extensions: ['hyperaudio'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (readFilePath) return readFilePath;
  } catch (error) {
    console.error(`getReadPath error: ${error}`);
  }
};
