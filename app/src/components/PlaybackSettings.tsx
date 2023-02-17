import { useCallback } from 'react';
import { useAtom } from 'jotai';

import Box from '@mui/material/Box';
import FeaturedVideoOutlinedIcon from '@mui/icons-material/FeaturedVideoOutlined';
import IconButton from '@mui/material/IconButton';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsIcon from '@mui/icons-material/Settings';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import VolumeDown from '@mui/icons-material/VolumeDown';
import { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSettingsDialog } from '@/modules';
import { _PlayerPin, _PlayerVolume } from '@/state';

interface PlaybackSettingsProps extends BoxProps {}

const PREFIX = 'PlaybackSettings';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(({ theme }) => ({
  lineHeight: 0,
}));

export const PlaybackSettings: React.FC<PlaybackSettingsProps> = ({ ...props }) => {
  // shared state
  const [pin, setPin] = useAtom(_PlayerPin);
  const [showSettings, settingsDialog] = useSettingsDialog();
  const [volume, setVolume] = useAtom(_PlayerVolume);

  const onChangeVolume = (v: number) => setVolume(v);
  const onMute = useCallback(() => setVolume(volume > 0 ? 0 : 1), [volume]);
  const onPinVideo = useCallback(() => setPin(!pin), [pin]);

  return (
    <>
      <Root className={classes.root}>
        <Stack spacing={4} direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Tooltip title={volume === 0 ? 'Unmute' : 'Mute'}>
              <IconButton size="small" onClick={onMute}>
                {volume > 0 ? <VolumeDown /> : <VolumeOffIcon />}
              </IconButton>
            </Tooltip>
            <Slider
              aria-label="Volume"
              max={1}
              min={0}
              onChange={(e, v) => onChangeVolume(v as number)}
              size="small"
              step={0.01}
              sx={{ minWidth: '64px' }}
              value={volume}
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Pin video">
              <IconButton
                size="small"
                onClick={onPinVideo}
                sx={theme => ({ color: pin ? theme.palette.text.primary : theme.palette.text.secondary })}
              >
                <FeaturedVideoOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton edge="end" onClick={() => showSettings()}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Root>
      {settingsDialog}
    </>
  );
};

export default PlaybackSettings;
