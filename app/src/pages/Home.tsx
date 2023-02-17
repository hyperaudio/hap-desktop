import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { _ProjectPath } from '@/state';
import { ElectronUtils } from '@/utils';

const PREFIX = 'HomePage';

const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled(Box)<BoxProps>(({ theme }) => ({
  alignContent: 'center',
  alignItems: 'center',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
}));

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filePath, setFilePath] = useAtom(_ProjectPath);

  const onOpen = useCallback(async () => {
    const readFilePath = await ElectronUtils.getReadPath();
    setIsLoading(true);
    setFilePath(readFilePath);
  }, []);

  useEffect(() => {
    if (filePath) navigate(`/edit`, { replace: true });
  }, [filePath]);

  return (
    <Root className={classes.root}>
      <Stack>
        <Container sx={{ maxWidth: '260px' }}>
          <Fade in={!isLoading}>
            <Stack direction="column" spacing={2}>
              <Typography align="center" gutterBottom variant="h6">
                Nothing to show
              </Typography>
              <Button
                color="primary"
                onClick={onOpen}
                size="small"
                startIcon={<FileOpenIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
              >
                Open project
              </Button>
              <Typography align="center" color="text.secondary" variant="body2">
                or
              </Typography>
              <Button startIcon={<AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />}>Create new one</Button>
            </Stack>
          </Fade>
        </Container>
      </Stack>
    </Root>
  );
};

export default HomePage;
