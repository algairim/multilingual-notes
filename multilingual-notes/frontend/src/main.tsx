import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Removed .tsx
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth'; // Removed .tsx

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Provider must wrap App */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);