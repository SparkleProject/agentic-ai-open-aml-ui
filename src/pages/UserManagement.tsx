import React from 'react';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';

export const UserManagement: React.FC = () => {
  const users = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'Compliance Officer', status: 'Active' },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', role: 'Analyst', status: 'Inactive' },
  ];

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>User Management</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            Manage team members and role-based access control (RBAC).
          </p>
        </div>
        <Button variant="primary">Invite User</Button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                <th style={{ padding: '16px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      backgroundColor: user.role === 'Admin' ? 'hsla(var(--error) / 0.1)' : 'hsla(var(--primary) / 0.1)',
                      color: user.role === 'Admin' ? 'hsl(var(--error))' : 'hsl(var(--primary))' 
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      backgroundColor: user.status === 'Active' ? 'hsla(var(--success) / 0.1)' : 'hsla(var(--text-muted) / 0.1)',
                      color: user.status === 'Active' ? 'hsl(var(--success))' : 'hsl(var(--text-muted))' 
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
