import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from '@/store/store';

import ErrorBoundary from '@/components/ErrorBoundary';

import App from '@/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
