import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, Settings, Users, Moon, Sun, Shield, UserCheck, LineChart, FileText, Zap } from 'lucide-react';
import styles from './AppLayout.module.css';

interface LayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ theme, toggleTheme }) => {
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
      </aside>
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.breadcrumbs}>
            <span>Administration</span>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Tenant Configuration</span>
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
