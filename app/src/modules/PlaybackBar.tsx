import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { BoxProps, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PlaybackControls, PlaybackSlider, PlaybackSettings } from '@/components';

interface PlaybackBarProps extends BoxProps {}

const PREFIX = 'PlaybackBar';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  height: '64px',
}));

export const PlaybackBar: React.FC<PlaybackBarProps> = ({ ...props }) => {
  return (
    <Root className={classes.root}>
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <Stack direction="row" justifyContent="center">
            <PlaybackControls />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" alignItems="center">
            <Container fixed maxWidth="sm">
              <PlaybackSlider />
            </Container>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack direction="row" justifyContent="center">
            <PlaybackSettings />
          </Stack>
        </Grid>
      </Grid>
    </Root>
  );
};

export default PlaybackBar;
