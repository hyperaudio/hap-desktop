import ReactPlayer from 'react-player';
import { Outlet } from 'react-router-dom';
import { createContext, MutableRefObject, PropsWithChildren, useMemo, useRef } from 'react';
import { useAtom } from 'jotai';

import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { createMuiTheme } from '@/themes';
import { _SettingsMode, _SettingsColor } from '@/state';

export const PlayerRefContext = createContext<MutableRefObject<ReactPlayer> | null>(null);

export const MainView: React.FC<PropsWithChildren> = () => {
  const [color] = useAtom(_SettingsColor);
  const [mode] = useAtom(_SettingsMode);

  const PlayerRef = useRef<ReactPlayer>() as MutableRefObject<ReactPlayer>;

  const theme = useMemo(
    () => createMuiTheme({ mode: mode as PaletteMode, color: color as Color }),
    [color, mode, createMuiTheme],
  );

  return (
    <PlayerRefContext.Provider value={PlayerRef}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Paper sx={{ borderRadius: 0, height: '100vh' }}>
          <Outlet />
        </Paper>
      </ThemeProvider>
    </PlayerRefContext.Provider>
  );
};

export default MainView;
