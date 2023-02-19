import { useDraggable } from '@neodrag/react';
import { useAtom } from 'jotai';
import { useContext, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { ToolbarProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { DraggableBoundsRefContext } from '@/views';
import { PlaybackControls, PlaybackSlider, PlaybackSettings, Video } from '@/components';
import { PlayerUrlAtom, PlayerPinAtom } from '@/state';

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
  const DraggableBoundsRef = useContext(DraggableBoundsRefContext);
  const DraggableRef = useRef(null);

  const { isDragging, dragState } = useDraggable(DraggableRef, {
    bounds: DraggableBoundsRef?.current,
    // disabled: true // TODO: remember this when implementing resize
  });

  // shared state
  const [url] = useAtom(PlayerUrlAtom);
  const [pin] = useAtom(PlayerPinAtom);

  // local state
  const [showPlayer, setShowPlayer] = useState<boolean>();

  const onMouseEnter = () => {
    if (pin) return;
    setShowPlayer(true);
  };

  const onMouseLeave = () => {
    if (pin) return;
    setShowPlayer(false);
  };

  // useEffect(() => {
  //   console.log({ isDragging, dragState });
  // }, [isDragging, dragState]);

  useEffect(() => setShowPlayer(pin), [pin]);

  return (
    <>
      <Root className={classes.root} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
      {url && (
        <Fade in={showPlayer}>
          <Card
            elevation={2}
            ref={DraggableRef}
            sx={theme => ({
              bottom: theme.spacing(10),
              opacity: pin ? 1 : showPlayer ? 1 : 0.66,
              p: 0.5,
              position: 'fixed',
              right: theme.spacing(2),
              width: '33%',
              zIndex: theme.zIndex.drawer,
            })}
          >
            <Box sx={theme => ({ borderRadius: theme.shape.borderRadius * 0.25, overflow: 'hidden' })}>
              <Video />
            </Box>
          </Card>
        </Fade>
      )}
    </>
  );
};

export default PlaybackBar;
