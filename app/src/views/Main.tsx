import { Outlet } from 'react-router-dom';
import { PropsWithChildren, useMemo } from 'react';
import { useAtom } from 'jotai';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { StatusBar, ToolBar } from '@/modules';
import { createMuiTheme } from '@/themes';
import { settingsModeAtom, settingsColorAtom } from '@/state';

export const MainView: React.FC<PropsWithChildren> = () => {
  const [mode] = useAtom(settingsModeAtom);
  const [color] = useAtom(settingsColorAtom);

  const theme = useMemo(
    () => createMuiTheme({ mode: mode as PaletteMode, color: color as Color }),
    [color, mode, createMuiTheme],
  );

  const SIDE_WIDTH = useMemo(() => `calc(${theme.spacing(6)} + 1px)`, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper sx={{ borderRadius: 0, height: '100vh' }}>
        <Drawer
          open
          sx={{
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            width: SIDE_WIDTH,
            '& .MuiDrawer-paper': {
              width: SIDE_WIDTH,
              overflowX: 'hidden',
            },
          }}
          variant="permanent"
        >
          <ToolBar />
        </Drawer>
        <Box component="main" sx={{ bottom: 0, left: SIDE_WIDTH, p: 3, position: 'fixed', right: 0, top: 0 }}>
          <Outlet />
          <Toolbar variant="dense" />
        </Box>
      </Paper>
      <AppBar
        component="footer"
        elevation={0}
        position="fixed"
        sx={theme => ({
          // borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'transparent',
          bottom: 0,
          left: SIDE_WIDTH,
          pointerEvents: 'none',
          right: 0,
          top: 'auto',
          width: 'auto',
        })}
      >
        <Toolbar variant="dense">
          <StatusBar />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default MainView;
