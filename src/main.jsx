import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { persistor, store } from './redux/store';
import './css/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
