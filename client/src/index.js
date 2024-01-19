import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NotificationPage from './NotificationPage';

import { Provider } from 'react-redux';
import { Store } from "./state/store";
import { persistStore } from 'redux-persist';
import { PersistGate } from "redux-persist/es/integration/react";

import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistStore(Store)}>
        <React.StrictMode>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<App />}/>
              <Route path='/not' element={<NotificationPage />}/>
            </Routes>
          </BrowserRouter>
        </React.StrictMode>
      </PersistGate>
    </Provider>
);

