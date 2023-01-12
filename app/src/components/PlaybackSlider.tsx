import { useState } from 'react';

import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import Stack from '@mui/material/Stack';
import { BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  const [value, setValue] = useState<number>(30);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const elapsedTime: number = 0.32;
  const remainingTime: number = 2.04;

  return (
    <Root className={classes.root}>
      <Slider aria-label="Playhead" value={value} onChange={handleChange} size="small" valueLabelDisplay="auto" />
      <Box className={classes.timespan}>
        <Typography>{elapsedTime}</Typography>
        <Typography>-{remainingTime}</Typography>
      </Box>
    </Root>
  );
};

export default PlaybackSlider;
