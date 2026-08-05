import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminPage from './pages/Admin.tsx';
import './index.css';

const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isAdminRoute ? <AdminPage /> : <App />}</StrictMode>
);
