import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    Welcome to EcoFit. This site is under development. Please check back later.
    {/* <App /> */}
  </StrictMode>
);