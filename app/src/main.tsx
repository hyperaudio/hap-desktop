import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'jotai';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Edit from './Edit';

// import './samples/node-api'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
