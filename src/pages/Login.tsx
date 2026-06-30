import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('default');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, tenantId);
      navigate('/alerts');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'hsl(var(--bg-primary))',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        backgroundColor: 'hsl(var(--bg-surface))',
        borderRadius: '16px',
        border: '1px solid hsla(var(--border))',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'hsla(var(--primary-transparent))',
            marginBottom: '16px',
          }}>
            <Shield size={32} color="hsl(var(--primary))" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--text-primary))' }}>
            Open AML
          </h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', marginTop: '4px' }}>
            Sign in to your compliance workspace
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
              Tenant ID
            </label>
            <input
              type="text"
              value={tenantId}
              onChange={e => setTenantId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid hsla(var(--border))',
                backgroundColor: 'hsl(var(--bg-primary))',
                color: 'hsl(var(--text-primary))',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@aml.local"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid hsla(var(--border))',
                backgroundColor: 'hsl(var(--bg-primary))',
                color: 'hsl(var(--text-primary))',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid hsla(var(--border))',
                backgroundColor: 'hsl(var(--bg-primary))',
                color: 'hsl(var(--text-primary))',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'hsla(var(--error) / 0.1)',
              color: 'hsl(var(--error))',
              fontSize: '0.875rem',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--primary))',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
