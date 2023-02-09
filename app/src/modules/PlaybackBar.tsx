import { useDraggable } from '@neodrag/react';
import { useEffect, useRef } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { ToolbarProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PlaybackControls, PlaybackSlider, PlaybackSettings } from '@/components';

interface PlaybackBarProps extends ToolbarProps {}

const PREFIX = 'PlaybackBar';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  height: '64px',
  userSelect: 'none',
}));

export const PlaybackBar: React.FC<PlaybackBarProps> = ({ ...props }) => {
  const draggableRef = useRef(null);
  const { isDragging, dragState } = useDraggable(draggableRef);

  useEffect(() => {
    console.log({ isDragging, dragState });
  }, [isDragging, dragState]);

  return (
    <>
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
      <Card
        ref={draggableRef}
        sx={theme => ({
          bottom: theme.spacing(10),
          p: 1,
          position: 'fixed',
          left: theme.spacing(2),
          width: '33%',
          zIndex: theme.zIndex.drawer,
        })}
      >
        Draggable
      </Card>
    </>
  );
};

export default PlaybackBar;
