import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

import { countAtom } from './atoms';

const Settings: React.FC = () => {
  // const [count, setCount] = useState(0);
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <p>
        <button onClick={() => setCount(count => count + 1)}>count is: {count}</button>
      </p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
};

export default Settings;
