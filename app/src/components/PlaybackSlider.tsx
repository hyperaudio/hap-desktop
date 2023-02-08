import { useMemo, useState } from 'react';

import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import Stack from '@mui/material/Stack';
import { BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
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
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(233); // TODO: wire this

  const displayElapsed = useMemo(() => formatTime(elapsed), [elapsed]);
  const displayRemaining = useMemo(() => formatTime(duration - elapsed), [duration, elapsed]);

  return (
    <Root className={classes.root}>
      <Slider
        aria-label="Playhead"
        max={duration}
        min={0}
        onChange={(e, v) => setElapsed(v as number)}
        size="small"
        value={elapsed}
        valueLabelDisplay="auto"
        valueLabelFormat={v => formatTime(v)}
      />
      <Box className={classes.timespan}>
        <Typography>{displayElapsed}</Typography>
        <Typography>{displayRemaining}</Typography>
      </Box>
    </Root>
  );
};

export default PlaybackSlider;
