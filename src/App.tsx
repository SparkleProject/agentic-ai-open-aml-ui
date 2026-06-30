import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './layouts/AppLayout';
import { Login } from './pages/Login';
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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/alerts" replace />} />
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
