import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Card } from '../Card/Card';

interface AuditFilterBarProps {
  onSearch: (term: string) => void;
  onModelChange: (model: string) => void;
  onStatusChange: (status: string) => void;
}

export const AuditFilterBar: React.FC<AuditFilterBarProps> = ({ onSearch, onModelChange, onStatusChange }) => {
  return (
    <Card glass style={{ padding: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ 
          flex: 1, 
          minWidth: '250px',
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'hsla(var(--background) / 0.5)',
          border: '1px solid hsla(var(--border) / 0.5)',
          borderRadius: '8px',
          padding: '0 12px'
        }}>
          <Search size={18} color="hsl(var(--text-muted))" />
          <input 
            type="text" 
            placeholder="Search by Log ID, Case ID, or Agent..."
            onChange={(e) => onSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '10px',
              color: 'hsl(var(--text-primary))',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={18} color="hsl(var(--text-secondary))" />
          <select 
            onChange={(e) => onModelChange(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid hsla(var(--border) / 0.5)',
              backgroundColor: 'hsla(var(--bg-elevated))',
              color: 'hsl(var(--text-primary))',
              outline: 'none'
            }}
          >
            <option value="">All Models</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="amazon-titan-text">Amazon Titan Text</option>
          </select>

          <select 
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid hsla(var(--border) / 0.5)',
              backgroundColor: 'hsla(var(--bg-elevated))',
              color: 'hsl(var(--text-primary))',
              outline: 'none'
            }}
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="ERROR">Error</option>
            <option value="HUMAN_OVERRIDE">Human Override</option>
          </select>
        </div>

      </div>
    </Card>
  );
};
