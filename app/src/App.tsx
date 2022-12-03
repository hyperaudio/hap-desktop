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
        <header>
          <p>
            <Link to="/settings">Settings</Link>
          </p>
          <p>
            <Link to="/edit">Edit</Link>
          </p>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default App;
