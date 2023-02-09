import React, { useState, useMemo, useRef, useCallback, useEffect, MutableRefObject } from 'react';
import ReactPlayer from 'react-player';
import { EditorState, ContentState, RawDraftContentBlock, convertFromRaw } from 'draft-js';
import { ipcRenderer } from 'electron';
import { useAtom } from 'jotai';
import { useDraggable } from '@neodrag/react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { BoxProps } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { Editor, createEntityMap, PlaybackBar, TabBar } from '@/modules';
import { ElectronUtils, FilesystemUtils } from '@/utils';
import { Preloader, Video } from '@/components';
import { Project } from '@/models';
import { _PlayerElapsed, _PlayerUrl, _ProjectPath } from '@/state';

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

const Root = styled(Box, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})<BoxProps>(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  justifyContent: 'center',
  width: '100%',
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
  const draggableRef = useRef(null);
  const playerRef = useRef<ReactPlayer>() as MutableRefObject<ReactPlayer>;

  const navigate = useNavigate();
  const { isDragging, dragState } = useDraggable(draggableRef);

  // shared state
  const [, setElapsed] = useAtom(_PlayerElapsed);
  const [filePath, setFilePath] = useAtom(_ProjectPath);
  const [url, setUrl] = useAtom(_PlayerUrl);

  // local state
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState({});
  const [metadata, setMetadata] = useState<Record<string, any>>({ id: uuidv4() });
  const [media, setMedia] = useState<Record<string, any>>({});
  const [data, setData] = useState<{ speakers: { [key: string]: any } | null; blocks: RawDraftContentBlock[] | null }>({
    speakers: null,
    blocks: null,
  });

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

  const seekTo = useCallback(
    (time: number): void => {
      setElapsed(time);
      if (playerRef.current) playerRef.current.seekTo(time, 'seconds');
    },
    [playerRef],
  );

  const handleOpen = useCallback(async (path: string) => {
    try {
      if (!path) return;
      setLoading(true);

      const project = await FilesystemUtils.readFile(path);
      if (!project) return;

      const { media, metadata, transcripts } = project;
      setData(transcripts[0].data as any);
      setMedia(media.reduce((acc, m) => ({ ...acc, [m.id ?? '0']: m }), {}));
      setMetadata(metadata);
      setSpeakers(transcripts[0].data.speakers);
      setUrl(media[0].url);
    } catch (error) {
      console.error(`handleOpen error: ${error}`);
      setError(error as Error);
    }
    setLoading(false);
  }, []);

  const noKaraoke = false;

  const div = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    ipcRenderer.on('menu-action', (_, action) => {
      console.log('menu-action', action);
      switch (action) {
        case 'save':
          ElectronUtils.getWritePath({}).then(path => {
            if (!path) return;
            const project: Project = {
              metadata,
              media,
              transcripts: [
                {
                  speakers,
                  // @ts-ignore
                  blocks: draft?.blocks ?? [],
                },
              ],
            };
            FilesystemUtils.writeFile(project, { path });
          });
          break;
        case 'save-as':
          ElectronUtils.getWritePath({ shouldSaveAs: true }).then(path => {
            if (!path) return;
            const project: Project = {
              metadata,
              media,
              transcripts: [
                {
                  speakers,
                  // @ts-ignore
                  blocks: draft?.blocks ?? [],
                },
              ],
            };
            console.log({ project });

            FilesystemUtils.writeFile(project, { path });
          });
          break;
        case 'open':
          ElectronUtils.getReadPath().then(path => {
            if (path) setFilePath(path);
          });
          break;
      }
    });
    return (() => ipcRenderer.removeAllListeners('menu-action')) as unknown as void; // FIXME
  }, [filePath]);

  useEffect(() => {
    if (filePath) {
      handleOpen(filePath);
    } else {
      navigate('/', { replace: true });
    }
  }, [filePath]);

  useEffect(() => {
    console.log({ isDragging, dragState });
  }, [isDragging, dragState]);

  if (loading) return <Preloader title="Loading your project…" />;
  if (!initialState) return null;

  return (
    <>
      <Root className={classes.root} alignItems="stretch" alignContent="stretch">
        <AppBar
          component="header"
          elevation={0}
          position="fixed"
          sx={theme => ({
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`,
            bottom: 'auto',
            left: 0,
            right: 0,
            top: 0,
            width: 'auto',
          })}
        >
          <TabBar />
        </AppBar>
        <Box
          sx={{
            bottom: '64px',
            left: 0,
            overflow: 'auto',
            position: 'fixed',
            right: 0,
            scrollBehavior: 'smooth',
            top: '48px',
          }}
        >
          <Toolbar />
          <Container maxWidth={false}>
            <Grid container>
              <Grid item xs={12} sm={3} />
              <Grid item xs={12} sm={6}>
                <Container ref={div} fixed maxWidth="sm">
                  {initialState ? (
                    <Editor
                      {...{ initialState, seekTo, speakers, setSpeakers }}
                      autoScroll
                      onChange={setDraft}
                      playheadDecorator={noKaraoke ? null : undefined}
                    />
                  ) : error ? (
                    <p>Error: {error?.message}</p>
                  ) : (
                    <></>
                  )}
                </Container>
              </Grid>
              <Grid item xs={12} sm={3} />
            </Grid>
          </Container>
          <Toolbar />
        </Box>
        <AppBar
          component="footer"
          elevation={0}
          position="fixed"
          sx={theme => ({
            bgcolor: 'background.paper',
            borderTop: `1px solid ${theme.palette.divider}`,
            bottom: 0,
            left: 0,
            right: 0,
            top: 'auto',
            width: 'auto',
          })}
        >
          <PlaybackBar></PlaybackBar>
        </AppBar>
      </Root>
      <Card
        ref={draggableRef}
        sx={theme => ({
          bottom: theme.spacing(1),
          p: 1,
          position: 'fixed',
          right: theme.spacing(2),
          width: '33%',
          zIndex: theme.zIndex.drawer,
        })}
      >
        {url && <Video ref={playerRef} />}
      </Card>
    </>
  );
};

export default EditPage;
