import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

import { Button, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import darkTheme from './themes/darkTheme';
import lightTheme from './themes/lightTheme';

import { SettingsAtom } from './state';

const App: React.FC = () => {
  const [settings] = useAtom(SettingsAtom);

  console.log('WHAT?', { settings });

  return (
    <ThemeProvider theme={settings.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <div>
        <Link to="/edit">Edit</Link>
      </div>
    </ThemeProvider>
  );
};

export default App;
