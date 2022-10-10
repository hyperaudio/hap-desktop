import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

import { countAtom, themeAtom } from './atoms';

import { Button, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import darkTheme from './themes/darkTheme';
import lightTheme from './themes/lightTheme';

import styles from 'styles/app.module.scss';

const App: React.FC = () => {
  // const [count, setCount] = useState(0);
  const [count, setCount] = useAtom(countAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Hello</Button>
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <p>Hello Electron + Vite + React!</p>
          <p>
            <button onClick={() => setCount(count => count + 1)}>count is: {count}</button>
          </p>
          <p>
            <Link to="/settings">Settings</Link>
          </p>
          <p>
            <Link to="/edit">Edit</Link>
          </p>
          <p>
            Edit <code>App.tsx</code> and save to test HMR updates.
          </p>
          <div>
            <div className={styles.staticPublic}>
              Place static files into the <code>/public</code> folder
            </div>
          </div>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default App;
