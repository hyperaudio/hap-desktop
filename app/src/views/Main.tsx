import { Outlet } from 'react-router-dom';
import { PropsWithChildren, useMemo } from 'react';
import { useAtom } from 'jotai';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { PlaybackBar, TabBar, PrefControls } from '@/modules';
import { createMuiTheme } from '@/themes';
import { settingsModeAtom, settingsColorAtom } from '@/state';

export const MainView: React.FC<PropsWithChildren> = () => {
  const [mode] = useAtom(settingsModeAtom);
  const [color] = useAtom(settingsColorAtom);

  const theme = useMemo(
    () => createMuiTheme({ mode: mode as PaletteMode, color: color as Color }),
    [color, mode, createMuiTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        component="header"
        elevation={0}
        position="fixed"
        sx={theme => ({
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bottom: 'auto',
          left: 0,
          right: 0,
          top: 0,
          width: 'auto',
        })}
      >
        <TabBar />
      </AppBar>
      <Paper sx={{ borderRadius: 0, height: '100vh' }}>
        <Box
          sx={{
            bottom: '56px',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            left: 0,
            overflow: 'auto',
            position: 'absolute',
            right: 0,
            scrollBehavior: 'smooth',
            top: '48px',
          }}
        >
          <Toolbar />
          <Outlet />
          <Toolbar />
        </Box>
      </Paper>
      <AppBar
        component="footer"
        elevation={0}
        position="fixed"
        sx={theme => ({
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          bottom: 0,
          left: 0,
          right: 0,
          top: 'auto',
          width: 'auto',
        })}
      >
        <PlaybackBar />
      </AppBar>
    </ThemeProvider>
  );
};

export default MainView;
