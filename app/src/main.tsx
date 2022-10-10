import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'jotai';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Settings from './Settings';
import Edit from './Edit';
// import './samples/node-api'
import 'styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
