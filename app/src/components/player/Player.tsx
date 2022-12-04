import React, { useMemo, useCallback, useRef, MutableRefObject, useState } from 'react';
import ReactPlayer from 'react-player';
import TC from 'smpte-timecode';

import Box from '@mui/material/Box';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { styled } from '@mui/material/styles';

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

const Player = ({
  url,
  playing,
  play,
  pause,
  time,
  setTime,
  duration,
  setDuration,
  pip,
  setPip,
  buffering,
  setBuffering,
  hideVideo,
  setHideVideo,
  seekTime,
  setSeekTime,
}: {
  url: string | null;
  playing: boolean;
  play: () => void;
  pause: () => void;
  time: number;
  setTime: (t: number) => void;
  duration: number;
  setDuration: (d: number) => void;
  pip: boolean;
  setPip: (p: boolean) => void;
  buffering: boolean;
  setBuffering: (b: boolean) => void;
  hideVideo: boolean;
  setHideVideo: (h: boolean) => void;
  seekTime: number;
  setSeekTime: (s: number) => void;
}): JSX.Element | null => {
  const ref = useRef<ReactPlayer>() as MutableRefObject<ReactPlayer>;

  const config = useMemo(
    () => ({
      forceAudio: false,
      forceVideo: true,
      file: {
        attributes: {
          // poster: 'https://via.placeholder.com/720x576.png?text=4:3', // TODO
          controlsList: 'nodownload',
        },
      },
    }),
    [],
  );

  const onDuration = useCallback((duration: number) => setDuration(duration), []);
  const onProgress = useCallback(({ playedSeconds }: { playedSeconds: number }) => setTime(playedSeconds), [setTime]);
  const onEnablePIP = useCallback(() => setPip(true), []);
  const onDisablePIP = useCallback(() => setPip(false), []);
  const onBuffer = useCallback(() => setBuffering(true), []);
  const onBufferEnd = useCallback(() => setBuffering(false), []);

  const handleSliderChange = useCallback(
    (event: any, value: number) => {
      setSeekTime(value);
      if (ref.current) ref.current.seekTo(value, 'seconds');
    },
    [ref],
  );

  const toggleVideo = useCallback(() => setHideVideo(!hideVideo), [setHideVideo, hideVideo]);

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
      <Box
        className={classes.controls}
        sx={{
          opacity: { md: playing ? (hideVideo || pip ? 1 : 0) : 1 },
          pointerEvents: { md: playing ? (hideVideo || pip ? 'all' : 'none') : 'all' },
          position: hideVideo || pip ? 'static' : 'absolute',
        }}
        onClick={e => e.stopPropagation()}
      >
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', width: '100%' }}>
          {buffering && seekTime !== time ? (
            <IconButton onClick={pause} color="inherit">
              {seekTime - time > 0 ? <FastForwardIcon /> : <FastRewindIcon />}
            </IconButton>
          ) : playing ? (
            <IconButton onClick={pause} color="inherit">
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton onClick={play} color="inherit">
              <PlayArrowIcon />
            </IconButton>
          )}
          <Slider
            aria-label="timeline"
            defaultValue={0}
            max={duration}
            min={0}
            onChange={handleSliderChange}
            size="small"
            sx={{ color: 'white' }}
            value={time}
            valueLabelDisplay="auto"
            valueLabelFormat={timecode}
          />
          <Tooltip title={`${hideVideo ? 'Show' : 'Hide'} video`}>
            <span>
              <IconButton disabled={pip} onClick={toggleVideo} color="inherit">
                {hideVideo ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  ) : null;
};

const timecode = (seconds: number, frameRate = 25, dropFrame = false) =>
  TC(seconds * 25, 25, false)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');

export default Player;
