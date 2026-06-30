import React, { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { fetchUsers, registerUser, type AuthUser } from '../services/api';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', password: '', full_name: '', roles: ['analyst'] });
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data.users);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(inviteForm);
      setShowInvite(false);
      setInviteForm({ email: '', password: '', full_name: '', roles: ['analyst'] });
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'compliance_officer': return { bg: 'hsla(var(--primary-transparent))', color: 'hsl(var(--primary))' };
      case 'auditor': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      default: return { bg: 'hsla(var(--success) / 0.1)', color: 'hsl(var(--success))' };
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>Loading users...</div>;
  }

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>{users.length} users in this tenant</p>
        </div>
        <Button variant="primary" onClick={() => setShowInvite(true)}>
          <UserPlus size={16} style={{ marginRight: '8px' }} />
          Invite User
        </Button>
      </div>

      {showInvite && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Invite New User</h3>
            <button onClick={() => setShowInvite(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-secondary))' }}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text" placeholder="Full name" required
              value={inviteForm.full_name} onChange={e => setInviteForm(f => ({ ...f, full_name: e.target.value }))}
              style={{ flex: '1 1 200px', padding: '8px 12px', borderRadius: '8px', border: '1px solid hsla(var(--border))', backgroundColor: 'hsl(var(--bg-primary))', color: 'hsl(var(--text-primary))' }}
            />
            <input
              type="email" placeholder="Email" required
              value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
              style={{ flex: '1 1 200px', padding: '8px 12px', borderRadius: '8px', border: '1px solid hsla(var(--border))', backgroundColor: 'hsl(var(--bg-primary))', color: 'hsl(var(--text-primary))' }}
            />
            <input
              type="password" placeholder="Password" required
              value={inviteForm.password} onChange={e => setInviteForm(f => ({ ...f, password: e.target.value }))}
              style={{ flex: '1 1 150px', padding: '8px 12px', borderRadius: '8px', border: '1px solid hsla(var(--border))', backgroundColor: 'hsl(var(--bg-primary))', color: 'hsl(var(--text-primary))' }}
            />
            <select
              value={inviteForm.roles[0]} onChange={e => setInviteForm(f => ({ ...f, roles: [e.target.value] }))}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid hsla(var(--border))', backgroundColor: 'hsl(var(--bg-primary))', color: 'hsl(var(--text-primary))' }}
            >
              <option value="analyst">Analyst</option>
              <option value="compliance_officer">Compliance Officer</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
            </select>
            <Button variant="primary" type="submit">Create</Button>
          </form>
          {error && <p style={{ color: 'hsl(var(--error))', marginTop: '8px', fontSize: '0.875rem' }}>{error}</p>}
        </Card>
      )}

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid hsla(var(--border))', color: 'hsl(var(--text-muted))' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Roles</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{user.full_name}</td>
                <td style={{ padding: '12px 16px', color: 'hsl(var(--text-secondary))' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {user.roles.map(role => {
                      const c = getRoleColor(role);
                      return (
                        <span key={role} style={{
                          padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem',
                          fontWeight: 600, backgroundColor: c.bg, color: c.color, textTransform: 'uppercase',
                        }}>
                          {role.replace('_', ' ')}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
                    backgroundColor: user.is_active ? 'hsla(var(--success) / 0.1)' : 'hsla(var(--error) / 0.1)',
                    color: user.is_active ? 'hsl(var(--success))' : 'hsl(var(--error))',
                  }}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                  No users found. Invite your first user above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
