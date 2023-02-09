import { LeapFrog } from '@uiball/loaders';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

interface PreloaderProps {
  title?: string | undefined;
  text?: string | undefined;
}

export const Preloader: React.FC<PreloaderProps> = ({ text, title, ...props }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <Stack alignItems="center">
        <LeapFrog size={32} speed={2} color={theme.palette.primary.main} />
        {title && (
          <Typography variant="subtitle2" mt={1} color="textSecondary">
            {title}
          </Typography>
        )}
        {text && (
          <Typography variant="caption" mt={1} color="textSecondary">
            {text}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
