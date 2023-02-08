import { useDraggable } from '@neodrag/react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { ToolbarProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PlaybackControls, PlaybackSlider, PlaybackSettings, Player } from '@/components';
import { useEffect, useRef } from 'react';

interface PlaybackBarProps extends ToolbarProps {}

const PREFIX = 'PlaybackBar';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  height: '64px',
}));

export const PlaybackBar: React.FC<PlaybackBarProps> = ({ children, ...props }) => {
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
        {/* <Box ref={draggableRef}>Draggable</Box> */}
      </Root>
      {children}
    </>
  );
};

export default PlaybackBar;
