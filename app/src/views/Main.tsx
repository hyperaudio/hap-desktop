import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Outlet } from 'react-router-dom';
import { createContext, MutableRefObject, PropsWithChildren, useMemo, useRef } from 'react';
import { useAtom } from 'jotai';
import { ipcRenderer } from 'electron';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { _SettingsMode, _SettingsColor, serverInfoAtom } from '@/state';
import { createMuiTheme } from '@/themes';

export const PlayerRefContext = createContext<MutableRefObject<ReactPlayer> | null>(null);
export const DraggableBoundsRefContext = createContext<MutableRefObject<HTMLElement> | null>(null);

const getServerInfo = (): Promise<[]> => ipcRenderer.invoke('server-info');

export const MainView: React.FC<PropsWithChildren> = () => {
  const [color] = useAtom(_SettingsColor);
  const [mode] = useAtom(_SettingsMode);
  const [serverInfo, setServerInfo] = useAtom(serverInfoAtom);

  const PlayerRef = useRef<ReactPlayer>() as MutableRefObject<ReactPlayer>;
  const BoundsRef = useRef<HTMLElement>() as MutableRefObject<HTMLElement>;

  const theme = useMemo(
    () => createMuiTheme({ mode: mode as PaletteMode, color: color as Color }),
    [color, mode, createMuiTheme],
  );

  useEffect(() => {
    ipcRenderer.on('server', (_, info) => setServerInfo(info));
    (async () => setServerInfo(await getServerInfo()))();
    return (() => ipcRenderer.removeAllListeners('server')) as unknown as void;
  }, []);

  useEffect(() => console.log({ serverInfo }), [serverInfo]);

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
