import ReactPlayer from 'react-player';
import { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';

const PREFIX = 'Video';
const classes = {
  player: `${PREFIX}-player`,
  playerWrapper: `${PREFIX}-playerWrapper`,
  stage: `${PREFIX}-stage`,
};

export const Video = forwardRef(
  (
    {
      hideVideo,
      pause,
      pip,
      play,
      playing,
      setBuffering,
      setDuration,
      setPip,
      setTime,
      url,
    }: {
      buffering: boolean;
      duration: number;
      hideVideo: boolean;
      pause: () => void;
      pip: boolean;
      play: () => void;
      playing: boolean;
      seekTime: number;
      setBuffering: (b: boolean) => void;
      setDuration: (d: number) => void;
      setHideVideo: (h: boolean) => void;
      setPip: (p: boolean) => void;
      setSeekTime: (s: number) => void;
      setTime: (t: number) => void;
      time: number;
      url: string | null;
    },
    ref: ForwardedRef<ReactPlayer | null>,
  ): JSX.Element | null => {
    const config = useMemo(
      () => ({
        forceAudio: false,
        forceVideo: true,
        file: {
          attributes: {
            // poster: 'https://via.placeholder.com/720x576.png?text=4:3', // TODO: ADD POSTER
            controlsList: 'nodownload',
          },
        },
      }),
      [],
    );

    const onBuffer = useCallback(() => setBuffering(true), []);
    const onBufferEnd = useCallback(() => setBuffering(false), []);
    const onDisablePIP = useCallback(() => setPip(false), []);
    const onDuration = useCallback((duration: number) => setDuration(duration), []);
    const onEnablePIP = useCallback(() => setPip(true), []);
    const onProgress = useCallback(({ playedSeconds }: { playedSeconds: number }) => setTime(playedSeconds), [setTime]);

    return url ? (
      <Box className={classes.stage} onClick={playing === true ? pause : play}>
        {!hideVideo && !pip && (
          <svg width="100%" viewBox={`0 0 16 9`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width={16} height={9} />
          </svg>
        )}
        <Grow in={!hideVideo || pip}>
          <Box className={classes.playerWrapper}>
            <ReactPlayer
              className={classes.player}
              config={config}
              height="100%"
              onBuffer={onBuffer}
              onBufferEnd={onBufferEnd}
              onDisablePIP={onDisablePIP}
              onDuration={onDuration}
              onEnablePIP={onEnablePIP}
              onPlay={play}
              onProgress={onProgress}
              playing={playing}
              progressInterval={100}
              ref={ref}
              style={{ lineHeight: 0, visibility: hideVideo || pip ? 'hidden' : 'visible' }}
              url={url}
              width="100%"
            />
          </Box>
        </Grow>
      </Box>
    ) : null;
  },
);

export default Video;
