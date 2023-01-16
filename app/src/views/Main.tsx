import { Outlet } from 'react-router-dom';
import { PropsWithChildren, useMemo } from 'react';
import { useAtom } from 'jotai';

import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { createMuiTheme } from '@/themes';
import { settingsModeAtom, settingsColorAtom } from '@/state';

export const MainView: React.FC<PropsWithChildren> = () => {
  const [color] = useAtom(settingsColorAtom);
  const [mode] = useAtom(settingsModeAtom);

  const theme = useMemo(
    () => createMuiTheme({ mode: mode as PaletteMode, color: color as Color }),
    [color, mode, createMuiTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper sx={{ borderRadius: 0, height: '100vh' }}>
        <Outlet />
      </Paper>
    </ThemeProvider>
  );
};

export default MainView;
