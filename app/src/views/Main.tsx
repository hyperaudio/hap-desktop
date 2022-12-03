import { PropsWithChildren } from 'react';
import { useAtom } from 'jotai';

import { AppBar, AppBarProps, Box, BoxProps, CssBaseline, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import darkTheme from '../themes/darkTheme';
import lightTheme from '../themes/lightTheme';

import { SettingsAtom } from '../state';

interface MainProps extends PropsWithChildren {}
interface MainBodyProps extends BoxProps {}
interface MainFootProps extends AppBarProps {}
interface MainViewType extends React.FC<MainProps> {
  Body: React.FC<MainBodyProps>;
  Foot: React.FC<MainFootProps>;
}

export const MainBody: React.FC<MainBodyProps> = ({ ...props }) => {
  return <Box {...props} />;
};
export const MainFoot: React.FC<MainFootProps> = ({ children, ...props }) => {
  return (
    <>
      <AppBar {...props} position="fixed" color="transparent" sx={{ bottom: 0, top: 'auto' }}>
        <Toolbar variant="dense">{children}</Toolbar>
      </AppBar>
      <Toolbar variant="dense" />
    </>
  );
};

export const MainView: MainViewType = ({ children }) => {
  const [settings] = useAtom(SettingsAtom);
  return (
    <ThemeProvider theme={settings.theme === 'dark' ? darkTheme : lightTheme}>
      <>
        <CssBaseline />
        {children}
      </>
    </ThemeProvider>
  );
};

MainView.Body = MainBody;
MainView.Foot = MainFoot;

export default MainView;
