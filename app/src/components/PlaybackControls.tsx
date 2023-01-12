import Box from '@mui/material/Box';
import Forward10Icon from '@mui/icons-material/Forward10';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Replay10Icon from '@mui/icons-material/Replay10';
import Stack from '@mui/material/Stack';
import { BoxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PlaybackControlsProps extends BoxProps {}

const PREFIX = 'PlaybackControls';
const classes = {
  root: `${PREFIX}-root`,
  speedButton: `${PREFIX}-speedButton`,
};

const Root = styled(Box)(({ theme }) => ({
  [`& .${classes.speedButton}`]: {
    // color: theme.palette.text.secondary,
    padding: theme.spacing(0.66, 0.66),
    fontWeight: '600',
    fontSize: '0.77rem',
    span: {
      fontSize: '0.5rem',
      marginRight: theme.spacing(0.33),
    },
  },
}));

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ ...props }) => {
  const onForward = () => {
    console.log('on rewind');
  };
  const onRewind = () => {
    console.log('on rewind');
  };

  const isPlaying: boolean = false;

  return (
    <Root className={classes.root}>
      <Stack direction="row" alignItems="center">
        <Tooltip title="Playback speed">
          <IconButton size="small" className={classes.speedButton}>
            <span>✕</span>1
          </IconButton>
        </Tooltip>
        <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
          <IconButton size="large">
            <PauseIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rewind 10s">
          <IconButton size="small" onClick={onRewind}>
            <Replay10Icon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Fast-forward 10s">
          <IconButton size="small" onClick={onForward}>
            <Forward10Icon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Root>
  );
};

export default PlaybackControls;
