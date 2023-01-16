import { useState } from 'react';

import Box from '@mui/material/Box';
import Forward10Icon from '@mui/icons-material/Forward10';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Replay10Icon from '@mui/icons-material/Replay10';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playing, setPlaying] = useState<boolean>();

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
            >
              <span>✕</span>1
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
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-label': 'Playback speed menu',
          dense: true,
        }}
      >
        <MenuItem onClick={handleClose}>
          <Box component="span" sx={{ fontSize: '0.5rem', mr: 1 }}>
            ✕
          </Box>{' '}
          0.5
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Box component="span" sx={{ fontSize: '0.5rem', mr: 1 }}>
            ✕
          </Box>{' '}
          0.75
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Box component="span" sx={{ fontSize: '0.5rem', mr: 1 }}>
            ✕
          </Box>{' '}
          1
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Box component="span" sx={{ fontSize: '0.5rem', mr: 1 }}>
            ✕
          </Box>{' '}
          1.25
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Box component="span" sx={{ fontSize: '0.5rem', mr: 1 }}>
            ✕
          </Box>{' '}
          1.5
        </MenuItem>
      </Menu>
    </>
  );
};

export default PlaybackControls;
