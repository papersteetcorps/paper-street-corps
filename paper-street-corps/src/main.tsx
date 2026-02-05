import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import '@fontsource/antonio';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="font-antonio">
        <App />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
