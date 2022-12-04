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

import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { Container, unstable_composeClasses } from '@mui/material';
import Box from '@mui/material/Box';
import { EditorState, ContentState, RawDraftContentBlock, convertFromRaw } from 'draft-js';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material/styles';

import { Editor, createEntityMap } from '../components/editor';
import Player from '../components/player/Player';
import { StatusBar } from '../modules';
import { MainView } from '../views';

const PREFIX = 'EditorPage';
const CONTROLS_HEIGHT = 60;

const classes = {
  controls: `${PREFIX}-controls`,
  editor: `${PREFIX}-editor`,
  paneTitle: `${PREFIX}-paneTitle`,
  player: `${PREFIX}-player`,
  root: `${PREFIX}-root`,
  stage: `${PREFIX}-stage`,
  theatre: `${PREFIX}-theatre`,
  toolbar: `${PREFIX}-toolbar`,
  transcript: `${PREFIX}-transcript`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  [`& .${classes.editor}`]: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
  },
  [`& .${classes.toolbar}`]: {
    background: 'black',
    color: theme.palette.primary.contrastText,
    zIndex: 1,
    '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
  },
  [`& .${classes.theatre}`]: {
    aligenItems: 'center',
    transition: `flex-basis ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
    backgroundColor: 'black',
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 2),
    },
  },
  [`& .${classes.stage}`]: {
    borderRadius: theme.shape.borderRadius * 2,
    lineHeight: 0,
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      border: `1px solid rgba(255,255,255,0.22)`,
    },
  },
  [`& .${classes.playerWrapper}`]: {
    height: '100%',
    paddingTop: '56.25%',
    position: 'relative',
    width: '100%',
  },
  [`& .${classes.player}`]: {
    borderRadius: theme.shape.borderRadius * 2,
    cursor: 'pointer',
    left: '0',
    overflow: 'hidden',
    position: 'absolute',
    top: '0',
  },
  [`& .${classes.controls}`]: {
    alignItems: 'center',
    background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.0))`,
    borderRadius: theme.shape.borderRadius * 2,
    bottom: 0,
    display: 'flex',
    height: `${CONTROLS_HEIGHT}px`,
    left: 0,
    padding: theme.spacing(1),
    right: 0,
    transition: `opacity ${theme.transitions.duration.short}ms`,
  },
  [`& .${classes.stage}:hover .${classes.controls}`]: {
    [theme.breakpoints.up('md')]: {
      opacity: '1 !important',
      pointerEvents: 'all !important',
    },
  },
  [`& .${classes.transcript}`]: {
    flexBasis: '60%',
    flexGrow: 1,
    width: '100%',
  },
  [`& .${classes.paneTitle}`]: {
    background: theme.palette.divider,
    color: theme.palette.text.primary,
    fontSize: '10px',
    fontWeight: '500',
    padding: theme.spacing(0, 0.5),
    position: 'absolute',
    top: 0,
    transition: `opacity ${theme.transitions.duration.standard}ms`,
    zIndex: 1,
  },
}));

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

  const [hideVideo, setHideVideo] = useState(false);

  const [time, setTime] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [pip, setPip] = useState(false);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  const seekTo = (time: number): void => {
    console.log('TODO seekTo', time);
  };

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

  const noKaraoke = false;

  const div = useRef<HTMLDivElement>();
  const [top, setTop] = useState(500);

  useLayoutEffect(() => {
    // console.log('useLayoutEffect');
    const value = div.current?.getBoundingClientRect().top ?? 500;
    console.log(div.current?.getBoundingClientRect(), value, pip);
    setTop(value);
  }, [div, pip]);

  return (
    <Root className={classes.root}>
      <Container maxWidth="md">
        {/* <button onClick={handleOpen} disabled={loading}>
          {loading ? 'Opening…' : 'Open'}
        </button>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <hr /> */}
        {url ? (
          <Player
            {...{
              url,
              playing,
              play,
              pause,
              buffering,
              setBuffering,
              time,
              setTime,
              duration,
              setDuration,
              pip,
              setPip,
              hideVideo,
              setHideVideo,
              seekTime,
              setSeekTime,
            }}
          />
        ) : null}
        {/* <hr /> */}
        <Box
          className={classes.transcript}
          sx={{
            overflow: 'auto',
            py: 2,
            display: 'block',
          }}
        >
          <Container ref={div} maxWidth="sm">
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
        </Box>
      </Container>
    </Root>
  );
};

const homeDirectory = (): Promise<string> => ipcRenderer.invoke('home-directory');

const writeFile = (options: SaveDialogOptions): Promise<SaveDialogReturnValue> =>
  ipcRenderer.invoke('write-file', options);

const openFile = (options: OpenDialogOptions): Promise<OpenDialogReturnValue> =>
  ipcRenderer.invoke('open-file', options);

export default EditPage;
