import React, { useState, useMemo, useRef, useCallback, useEffect, useLayoutEffect, MutableRefObject } from 'react';
import {
  FileFilter,
  IpcRendererEvent,
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
  ipcRenderer,
} from 'electron';
import { readFileSync, createWriteStream } from 'fs';
import path from 'path';
import { strict as assert } from 'node:assert';
import JSZip from 'jszip';
import { EditorState, ContentState, RawDraftContentBlock, convertFromRaw } from 'draft-js';
import { v4 as uuidv4 } from 'uuid';

import { Button, Box, Card, Container, Grid, GridProps, Typography, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Pinwheel } from '@uiball/loaders';

import { Editor, createEntityMap } from '@/modules';
import { Player } from '@/components';

const PREFIX = 'EditorPage';
const CONTROLS_HEIGHT = 60;

const classes = {
  root: `${PREFIX}-Root`,
  controls: `${PREFIX}-controls`,
  editor: `${PREFIX}-editor`,
  paneTitle: `${PREFIX}-paneTitle`,
  player: `${PREFIX}-player`,
  stage: `${PREFIX}-stage`,
  theatre: `${PREFIX}-theatre`,
  toolbar: `${PREFIX}-toolbar`,
  transcript: `${PREFIX}-transcript`,
};

const Root = styled(Grid, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})<GridProps>(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'absolute',
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
  const theme = useTheme();

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

  const [filePath, setFilePath] = useState<string | undefined>();
  console.log({ filePath });

  const handleSave = useCallback(
    async (saveAs: boolean = false) => {
      // if (!blocks || blocks.length === 0) return;

      setSaving(true);

      try {
        const defaultPath = path.join(await homeDirectory(), 'Untitled.hyperaudio');
        console.log({ filePath, saveAs, 'saveAs || !filePath': saveAs || !filePath, defaultPath });

        const writeFilePath =
          saveAs || !filePath
            ? (await (
                await writeFile({
                  title: 'Save Hyperaudio file as…',
                  defaultPath,
                  properties: ['createDirectory', 'showOverwriteConfirmation'],
                  filters: [
                    { name: 'Hyperaudio Files', extensions: ['hyperaudio'] },
                    { name: 'All Files', extensions: ['*'] },
                  ],
                })
              ).filePath) ?? defaultPath
            : filePath ?? defaultPath;

        assert.notEqual(writeFilePath, '');
        setFilePath(writeFilePath);

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
          .pipe(createWriteStream(writeFilePath));
      } catch (error) {
        console.error(error);
        setError(error as Error);
        setSaving(false);
      }
      // setSaving(false);
    },
    [metadata, media, speakers, draft, filePath],
  );

  const handleOpen = useCallback(async () => {
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
      console.log({ readFilePath });
      setFilePath(readFilePath);

      if (readFilePath) setLoading(true);

      const zip = await JSZip.loadAsync(readFileSync(readFilePath));
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
        case 'save':
          handleSave(false);
          break;
        case 'save-as':
          handleSave(true);
          break;
        case 'open':
          handleOpen();
          break;
      }
    });

    return (() => ipcRenderer.removeAllListeners('menu-action')) as unknown as void; // FIXME
  }, []);

  const noKaraoke = false;

  const div = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const [top, setTop] = useState(500);

  useLayoutEffect(() => {
    // console.log('useLayoutEffect');
    const value = div.current?.getBoundingClientRect().top ?? 500;
    console.log(div.current?.getBoundingClientRect(), value, pip);
    setTop(value);
  }, [div, pip]);

  return (
    <Root container className={classes.root} alignItems="stretch" alignContent="stretch">
      {!initialState ? (
        <Grid item xs sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box textAlign="center">
            {loading ? (
              <Pinwheel size={36} lineWeight={2.5} speed={1.5} color={theme.palette.primary.main} />
            ) : (
              <Stack direction="column" spacing={2}>
                <Typography gutterBottom variant="h6">
                  No file to show
                </Typography>
                <Button
                  startIcon={<FileOpenIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                  color="primary"
                  disabled={loading}
                  size="small"
                  onClick={handleOpen}
                >
                  Open existing
                </Button>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
                <Button startIcon={<AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />} disabled={loading}>
                  Create new
                </Button>
              </Stack>
            )}
          </Box>
        </Grid>
      ) : (
        <Grid item container>
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
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
          </Grid>
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            <Container maxWidth="lg">
              <Box className={classes.transcript} sx={{ overflow: 'auto', display: 'block' }}>
                <Container ref={div} fixed maxWidth="sm">
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
                    <p></p>
                  )}
                </Container>
              </Box>
            </Container>
          </Grid>
        </Grid>
      )}
    </Root>
  );
};

const homeDirectory = (): Promise<string> => ipcRenderer.invoke('home-directory');

const writeFile = (options: SaveDialogOptions): Promise<SaveDialogReturnValue> =>
  ipcRenderer.invoke('write-file', options);

const openFile = (options: OpenDialogOptions): Promise<OpenDialogReturnValue> =>
  ipcRenderer.invoke('open-file', options);

export default EditPage;
