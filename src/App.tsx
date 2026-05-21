import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/AppLayout';
import { ConfigurationPortal } from './pages/ConfigurationPortal';
import { UserManagement } from './pages/UserManagement';
import { AlertQueue } from './pages/AlertQueue';
import { CaseWorkspace } from './pages/CaseWorkspace';
import { SMRWorkspace } from './pages/SMRWorkspace';
import { KYCDashboard } from './pages/KYCDashboard';
import { KYCDetail } from './pages/KYCDetail';
import { ResponsibleAIDashboard } from './pages/ResponsibleAIDashboard';
import { AuditTrailExplorer } from './pages/AuditTrailExplorer';
import { ObservabilityDashboard } from './pages/ObservabilityDashboard';
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
          <Route path="reports/smr/:caseId" element={<SMRWorkspace />} />
          <Route path="kyc" element={<KYCDashboard />} />
          <Route path="kyc/:customerId" element={<KYCDetail />} />
          <Route path="responsible-ai" element={<ResponsibleAIDashboard />} />
          <Route path="audit-trail" element={<AuditTrailExplorer />} />
          <Route path="observability" element={<ObservabilityDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
