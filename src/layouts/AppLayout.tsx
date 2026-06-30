import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Activity, Settings, Users, Moon, Sun, Shield, UserCheck, LineChart, FileText, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './AppLayout.module.css';

interface LayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Shield className={styles.logoIcon} size={28} />
          <span>Open AML</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>ADMINISTRATION</div>
          <NavLink
            to="/admin/config"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Settings size={20} />
            Tenant Config
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Users size={20} />
            User Management
          </NavLink>
          <NavLink
            to="/responsible-ai"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <LineChart size={20} />
            Responsible AI
          </NavLink>
          <NavLink
            to="/audit-trail"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <FileText size={20} />
            Audit Trail
          </NavLink>

          <div className={styles.navSection}>MONITORING</div>
          <NavLink
            to="/observability"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Activity size={20} />
            Observability
          </NavLink>

          <div className={styles.navSection}>COMPLIANCE</div>
          <NavLink
            to="/kyc"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <UserCheck size={20} />
            KYC Onboarding
          </NavLink>

          <div className={styles.navSection}>WORKFLOWS</div>
          <NavLink
            to="/alerts"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Zap size={20} />
            Simulations
          </NavLink>
        </nav>

        {user && (
          <div style={{
            marginTop: 'auto',
            padding: '16px',
            borderTop: '1px solid hsla(var(--border))',
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
              {user.full_name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '8px' }}>
              {user.email}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {user.roles.map(role => (
                <span
                  key={role}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    backgroundColor: 'hsla(var(--primary-transparent))',
                    color: 'hsl(var(--primary))',
                    textTransform: 'uppercase',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid hsla(var(--border))',
                backgroundColor: 'transparent',
                color: 'hsl(var(--text-secondary))',
                fontSize: '0.8rem',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.breadcrumbs}>
            <span>Open AML</span>
            {user && (
              <>
                <span className={styles.separator}>/</span>
                <span className={styles.current}>{user.tenant_id}</span>
              </>
            )}
          </div>
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
