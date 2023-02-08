import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Forward10Icon from '@mui/icons-material/Forward10';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Replay10Icon from '@mui/icons-material/Replay10';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { BoxProps, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';

import { _PlayerPlaying } from '@/state';

interface PlaybackControlsProps extends BoxProps {}

const PREFIX = 'PlaybackControls';
const classes = {
  root: `${PREFIX}-root`,
  speedButton: `${PREFIX}-speedButton`,
  menuButton: `${PREFIX}-menuButton`,
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
  [`& .${classes.menuButton}`]: {
    span: {
      fontSize: '0.5rem',
      display: 'inline-block',
      marginRight: theme.spacing(0.33),
    },
  },
}));

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ ...props }) => {
  //shared state
  const [playing, setPlaying] = useAtom(_PlayerPlaying);

  // local state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rate, setRate] = useState<number>(1);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onForward = () => {
    console.log('on rewind');
  };
  const onRewind = () => {
    console.log('on rewind');
  };

  const displayPlaybackRate = useMemo(() => {
    const round = Math.round(rate * 10) / 10;
    const parsed = round < 1 ? round.toString().slice(1, 3) : round;
    return parsed;
  }, [rate]);

  return (
    <>
      <Root className={classes.root}>
        <Stack direction="row" alignItems="center">
          <Tooltip title="Playback speed">
            <IconButton
              size="small"
              className={classes.speedButton}
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={theme => ({ minWidth: theme.typography.pxToRem(36) })}
            >
              <span>✕</span>
              {displayPlaybackRate}
            </IconButton>
          </Tooltip>
          <Tooltip title={playing ? 'Pause' : 'Play'}>
            <IconButton size="large" onClick={() => setPlaying(!playing)}>
              {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
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
      <Menu
        MenuListProps={{ 'aria-label': 'Playback speed menu', dense: true }}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        id="basic-menu"
        onClose={handleClose}
        open={open}
        slotProps={{ backdrop: { style: { opacity: 0 } } }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box>
          <Slider
            aria-label="PlaybackRateSlider"
            max={1.5}
            step={0.01}
            min={0.5}
            onChange={(e, v: number | number[]) => setRate(v as number)}
            onChangeCommitted={() => setAnchorEl(null)}
            orientation="vertical"
            size="small"
            sx={{
              '& input[type="range"]': { WebkitAppearance: 'slider-vertical' },
              height: '80px',
              lineHeight: '0',
            }}
            value={rate}
            valueLabelDisplay="auto"
            valueLabelFormat={v => v}
          />
        </Box>
      </Menu>
    </>
  );
};

export default PlaybackControls;
