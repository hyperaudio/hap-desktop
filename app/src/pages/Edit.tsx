import {
  ipcRenderer,
  IpcRendererEvent,
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
  FileFilter,
} from 'electron';
import { readFileSync, createWriteStream } from 'fs';
import path from 'path';
import JSZip from 'jszip';

import React, { useState, useMemo, useRef, useCallback, useEffect, EffectCallback } from 'react';
import { Container, unstable_composeClasses } from '@mui/material';
import { EditorState, ContentState, RawDraftContentBlock, convertFromRaw } from 'draft-js';
import { v4 as uuidv4 } from 'uuid';

import { Editor, createEntityMap } from '../components/editor';
import Player from '../components/player/Player';
import { StatusBar } from '../modules';
import { MainView } from '../views';

export const EditPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error>();

  const [metadata, setMetadata] = useState<Record<string, any>>({ id: uuidv4() });
  const [media, setMedia] = useState<Record<string, any>>({});
  const [url, setUrl] = useState<string | undefined>();
  const [data, setData] = useState<{ speakers: { [key: string]: any } | null; blocks: RawDraftContentBlock[] | null }>({
    speakers: null,
    blocks: null,
  });

  const [speakers, setSpeakers] = useState({});
  const { blocks } = data ?? {};

  const initialState = useMemo(
    () => blocks && EditorState.createWithContent(convertFromRaw({ blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  const [draft, setDraft] = useState<{
    speakers: { [key: string]: any };
    blocks: RawDraftContentBlock[];
    contentState: ContentState;
  }>();

  const [time, setTime] = useState(0);

  const noKaraoke = false; // FIXME
  const seekTo = (time: number): void => {
    console.log('TODO seekTo', time);
  };
  const [playing, setPlaying] = useState(false);
  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  const handleSave = useCallback(async () => {
    // if (!blocks || blocks.length === 0) return;

    setSaving(true);
    try {
      const defaultPath = path.join(await homeDirectory(), 'Untitled.hyperaudio');

      const filePath =
        (await (
          await writeFile({
            title: 'Save Hyperaudio file as…',
            defaultPath,
            properties: ['createDirectory', 'showOverwriteConfirmation'],
            filters: [
              { name: 'Hyperaudio Files', extensions: ['hyperaudio'] },
              { name: 'All Files', extensions: ['*'] },
            ],
          })
        ).filePath) ?? defaultPath;

      const zip = JSZip();
      zip.file('metadata.json', JSON.stringify(metadata));
      zip.file(`transcript/${metadata.id}.json`, JSON.stringify({ speakers, blocks: draft?.blocks ?? [] }));
      Object.keys(media).forEach(id => zip.file(`media/${id}`, media[id].buffer));

      let timeout = setTimeout(() => setSaving(false), 5000);
      await zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true }, metadata => {
          console.log('TODO progress', metadata);
          clearTimeout(timeout);
          timeout = setTimeout(() => setSaving(false), 5000);
        })
        .pipe(createWriteStream(filePath));
    } catch (error) {
      setError(error as Error);
      setSaving(false);
    }
    // setSaving(false);
  }, [metadata, media, speakers, draft]);

  const handleOpen = useCallback(async () => {
    setLoading(true);
    try {
      const {
        filePaths: [filePath],
      } = await openFile({
        title: 'Open Hyperaudio file…',
        properties: ['openFile', 'promptToCreate', 'createDirectory'],
        filters: [
          { name: 'Hyperaudio Files', extensions: ['hyperaudio'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      const zip = await JSZip.loadAsync(readFileSync(filePath));
      const media = await Promise.all(
        zip.file(/^media\//).map(async file => ({
          id: file.name.split('/').pop()?.split('.').reverse().pop(),
          name: file.name,
          buffer: await file.async('arraybuffer'),
          url: URL.createObjectURL(await file.async('blob')),
        })),
      );

      console.log({ media });
      setUrl(media[0].url);
      setMedia(media.reduce((acc, m) => ({ ...acc, [m.id ?? '0']: m }), {}));

      const metadata = JSON.parse((await zip?.file('metadata.json')?.async('text')) ?? '{}');
      const transcripts = await Promise.all(
        zip.file(/^transcript\//).map(async file => ({
          name: file.name,
          data: JSON.parse((await file.async('text')) ?? '{}'),
        })),
      );

      console.log({ metadata, transcripts });
      setMetadata(metadata);
      setData(transcripts[0].data as any);
      setSpeakers(transcripts[0].data.speakers);
    } catch (error) {
      setError(error as Error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    ipcRenderer.on('menu-action', (_, action) => {
      console.log('menu-action', action);
      switch (action) {
        case 'save-as':
          handleSave();
          break;
        case 'open':
          handleOpen();
          break;
      }
    });

    return (() => ipcRenderer.removeAllListeners('menu-action')) as unknown as void; // FIXME
  }, []);

  return (
    <Container maxWidth="md">
      <button onClick={handleOpen} disabled={loading}>
        {loading ? 'Opening…' : 'Open'}
      </button>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save'}
      </button>
      {url ? <Player {...{ url, playing, play, pause, setTime }} /> : null}
      {initialState ? (
        <Editor
          {...{ initialState, time, seekTo, speakers, setSpeakers, playing, play, pause }}
          autoScroll
          onChange={setDraft}
          playheadDecorator={noKaraoke ? null : undefined}
        />
      ) : error ? (
        <p>Error: {error?.message}</p>
      ) : (
        <p>{loading ? 'opening file / skeleton' : 'no file, please open one'}</p>
      )}
    </Container>
  );
};

const homeDirectory = (): Promise<string> => ipcRenderer.invoke('home-directory');

const writeFile = (options: SaveDialogOptions): Promise<SaveDialogReturnValue> =>
  ipcRenderer.invoke('write-file', options);

const openFile = (options: OpenDialogOptions): Promise<OpenDialogReturnValue> =>
  ipcRenderer.invoke('open-file', options);

export default EditPage;
