import { PropsWithChildren } from 'react';
import { useAtom } from 'jotai';
import { Outlet } from 'react-router-dom';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import darkTheme from '../themes/darkTheme';
import lightTheme from '../themes/lightTheme';

import { SettingsAtom } from '../state';

export const Main: React.FC<PropsWithChildren> = () => {
  const [settings] = useAtom(SettingsAtom);

  return (
    <ThemeProvider theme={settings.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
};

export default Main;
