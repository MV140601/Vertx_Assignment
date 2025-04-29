import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react';
import sessionstore  from './redux/sessionstore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {persistStore} from "redux-persist";
let persistor = persistStore(sessionstore);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={sessionstore}>
    <PersistGate loading={null} persistor={persistor}>
   <App />
   </PersistGate>
   </Provider>
</React.StrictMode>
)
