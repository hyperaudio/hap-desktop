import { Outlet } from 'react-router-dom';
import { PropsWithChildren, useMemo } from 'react';
import { useAtom } from 'jotai';

import { AppBar, Box, CssBaseline, Color, Drawer, PaletteMode, Paper, Toolbar } from '@mui/material';
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
      <Paper sx={{ display: 'flex', minHeight: '100vh' }}>
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
          <Toolbar variant="dense" />
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
          left: SIDE_WIDTH,
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
