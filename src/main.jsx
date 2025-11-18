import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';//now imported in index.html
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
