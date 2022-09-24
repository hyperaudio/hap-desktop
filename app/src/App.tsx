import { useState } from 'react';
import { useAtom } from 'jotai';

import { countAtom } from './atoms';

import styles from 'styles/app.module.scss';

const App: React.FC = () => {
  // const [count, setCount] = useState(0);
  const [count, setCount] = useAtom(countAtom);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <p>Hello Electron + Vite + React!</p>
        <p>
          <button onClick={() => setCount(count => count + 1)}>count is: {count}</button>
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
  );
};

export default App;
