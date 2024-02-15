import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux-store';

import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = "947884460324-n3kd271m4sfgaqi3hnuv9kiu4n6vhsog.apps.googleusercontent.com"
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <App />
    </Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);
