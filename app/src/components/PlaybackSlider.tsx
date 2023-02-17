import { useAtom } from 'jotai';
import { useContext, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PlayerRefContext } from '@/views';
import { _PlayerDuration, _PlayerElapsed } from '@/state';
import { formatTime } from '@/utils';

interface PlaybackSliderProps extends BoxProps {}

const PREFIX = 'PlaybackSlider';
const classes = {
  root: `${PREFIX}-root`,
  timespan: `${PREFIX}-timespan`,
};

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  lineHeight: 0,
  [`& .${classes.timespan}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: theme.spacing(2.22),
    '& > *': {
      color: theme.palette.text.secondary,
      display: 'block',
      fontSize: '0.66rem',
      fontWeight: 500,
      letterSpacing: 0.2,
      opacity: 0.66,
    },
  },
}));

export const PlaybackSlider: React.FC<PlaybackSliderProps> = ({ ...props }) => {
  const PlayerRef = useContext(PlayerRefContext);

  // shared state
  const [elapsed, setElapsed] = useAtom(_PlayerElapsed);
  const [duration] = useAtom(_PlayerDuration);

  const displayElapsed = useMemo(() => formatTime(elapsed), [elapsed]);
  const displayRemaining = useMemo(() => formatTime(duration - elapsed), [duration, elapsed]);

  const seekTo = useCallback(
    (time: number) => {
      if (!PlayerRef) return;
      setElapsed(time);
      PlayerRef.current.seekTo(time, 'seconds');
    },
    [PlayerRef],
  );

  return (
    <Root className={classes.root}>
      <Slider
        aria-label="Playhead"
        max={duration}
        min={0}
        onChange={(e, v) => seekTo(v as number)}
        size="small"
        value={elapsed}
        valueLabelFormat={v => formatTime(v)}
      />
      <Box className={classes.timespan}>
        <Typography>{displayElapsed}</Typography>
        <Typography>-{displayRemaining}</Typography>
      </Box>
    </Root>
  );
};

export default PlaybackSlider;
