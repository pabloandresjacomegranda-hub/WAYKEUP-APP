import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/i18n';
import { initAudioUnlock } from './lib/audioUnlock';
import App from './App.tsx';
import './index.css';

initAudioUnlock();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
