import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'jotai';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { EditPage } from './pages';
import { MainView } from './views';

// import './samples/node-api'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <HashRouter>
        <Routes>
          <Route element={<MainView />}>
            <Route path="*" element={<EditPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
