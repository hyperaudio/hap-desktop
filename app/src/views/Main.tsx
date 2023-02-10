import ReactPlayer from 'react-player';
import { Outlet } from 'react-router-dom';
import { createContext, MutableRefObject, PropsWithChildren, useMemo, useRef } from 'react';
import { useAtom } from 'jotai';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { _SettingsMode, _SettingsColor } from '@/state';
import { createMuiTheme } from '@/themes';

export const PlayerRefContext = createContext<MutableRefObject<ReactPlayer> | null>(null);
export const DraggableBoundsRefContext = createContext<MutableRefObject<HTMLElement> | null>(null);

export const MainView: React.FC<PropsWithChildren> = () => {
  const [color] = useAtom(_SettingsColor);
  const [mode] = useAtom(_SettingsMode);

  const PlayerRef = useRef<ReactPlayer>() as MutableRefObject<ReactPlayer>;
  const BoundsRef = useRef<HTMLElement>() as MutableRefObject<HTMLElement>;

  const theme = useMemo(
    () => createMuiTheme({ mode: mode as PaletteMode, color: color as Color }),
    [color, mode, createMuiTheme],
  );

  return (
    <DraggableBoundsRefContext.Provider value={BoundsRef}>
      <PlayerRefContext.Provider value={PlayerRef}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ height: '100vh' }}>
            <Outlet />
          </Box>
        </ThemeProvider>
      </PlayerRefContext.Provider>
    </DraggableBoundsRefContext.Provider>
  );
};

export default MainView;
