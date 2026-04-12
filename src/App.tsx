import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/AppLayout';
import { ConfigurationPortal } from './pages/ConfigurationPortal';
import { UserManagement } from './pages/UserManagement';
import { AlertQueue } from './pages/AlertQueue';
import { CaseWorkspace } from './pages/CaseWorkspace';
import './index.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Navigate to="/admin/config" replace />} />
          <Route path="admin/config" element={<ConfigurationPortal />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="alerts" element={<AlertQueue />} />
          <Route path="cases/:id" element={<CaseWorkspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
