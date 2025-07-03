import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App';
import './index.css';
import { Typography } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Typography variant="h1">Welcome to EcoFit.</Typography>
    <Typography variant="body1">This site is under development. Please check back later.</Typography>
    {/* <App /> */}
  </StrictMode>
);