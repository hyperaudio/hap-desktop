import { useCallback, useState } from 'react';

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

interface PlaybackSettingsProps extends BoxProps {}

const PREFIX = 'PlaybackSettings';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Box)(({ theme }) => ({
  lineHeight: 0,
}));

export const PlaybackSettings: React.FC<PlaybackSettingsProps> = ({ ...props }) => {
  const [showSettings, settingsDialog] = useSettingsDialog();

  const [value, setValue] = useState<number>(30);
  const [video, setVideo] = useState<boolean>(true);

  const onMute = useCallback(() => {
    if (value > 0) setValue(0);
    console.log('Mute');
  }, [value]);

  const onPinVideo = useCallback(() => {
    setVideo(!video);
  }, [video]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  return (
    <>
      <Root className={classes.root}>
        <Stack spacing={4} direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Tooltip title={value === 0 ? 'Unmute' : 'Mute'}>
              <IconButton size="small" onClick={onMute}>
                {value > 0 ? <VolumeDown /> : <VolumeOffIcon />}
              </IconButton>
            </Tooltip>
            <Slider
              aria-label="Volume"
              onChange={handleChange}
              size="small"
              sx={{ minWidth: '64px' }}
              value={value}
              valueLabelDisplay="auto"
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Pin video">
              <IconButton
                size="small"
                onClick={onPinVideo}
                sx={theme => ({ color: video ? theme.palette.text.primary : theme.palette.text.secondary })}
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
