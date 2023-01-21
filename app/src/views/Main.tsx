import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PropsWithChildren, useMemo } from 'react';
import { useAtom } from 'jotai';
import { ipcRenderer } from 'electron';

import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { Color, PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { createMuiTheme } from '@/themes';
import { settingsModeAtom, settingsColorAtom, serverInfoAtom } from '@/state';

const getServerInfo = (): Promise<[]> => ipcRenderer.invoke('server-info');

export const MainView: React.FC<PropsWithChildren> = () => {
  const [color] = useAtom(settingsColorAtom);
  const [mode] = useAtom(settingsModeAtom);
  const [serverInfo, setServerInfo] = useAtom(serverInfoAtom);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper sx={{ borderRadius: 0, height: '100vh' }}>
        <Outlet />
      </Paper>
    </ThemeProvider>
  );
};

export default MainView;
