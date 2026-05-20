import React from 'react';
import { CheckCircle, Clock, XCircle, MinusCircle } from 'lucide-react';
import type { VerificationStatus } from '../../services/mockKYCData';

interface VerificationBadgeProps {
  label: string;
  status: VerificationStatus;
}

const STATUS_CONFIG: Record<VerificationStatus, {
  icon: React.ReactNode;
  color: string;
  bg: string;
  text: string;
}> = {
  VERIFIED: {
    icon: <CheckCircle size={16} />,
    color: 'hsl(var(--success))',
    bg: 'hsla(var(--success) / 0.1)',
    text: 'Verified',
  },
  PENDING: {
    icon: <Clock size={16} />,
    color: 'hsl(var(--warning))',
    bg: 'hsla(var(--warning) / 0.1)',
    text: 'Pending',
  },
  FAILED: {
    icon: <XCircle size={16} />,
    color: 'hsl(var(--error))',
    bg: 'hsla(var(--error) / 0.1)',
    text: 'Failed',
  },
  NOT_STARTED: {
    icon: <MinusCircle size={16} />,
    color: 'hsl(var(--text-muted))',
    bg: 'hsla(var(--bg-elevated))',
    text: 'Not Started',
  },
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ label, status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: config.bg,
      border: `1px solid ${config.color}22`,
      transition: 'all 0.2s ease',
    }}>
      <span style={{
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'hsl(var(--text-primary))',
      }}>
        {label}
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: config.color,
        fontSize: '0.8rem',
        fontWeight: 600,
      }}>
        {config.icon}
        {config.text}
      </div>
    </div>
  );
};
