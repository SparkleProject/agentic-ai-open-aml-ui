import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { OnboardingProgress } from '../components/KYC/OnboardingProgress';
import { Users, AlertTriangle, CheckCircle, UserPlus } from 'lucide-react';
import { fetchKYCCustomers } from '../services/api';
import type { KYCCustomer, RiskLevel } from '../services/mockKYCData';

type FilterOption = RiskLevel | 'ALL';

export const KYCDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<KYCCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('ALL');

  useEffect(() => {
    fetchKYCCustomers().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const getRiskStyle = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'HIGH': return { bg: 'hsla(var(--error) / 0.08)', color: 'hsl(var(--error))' };
      case 'MEDIUM': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      case 'LOW': return { bg: 'hsla(var(--success) / 0.1)', color: 'hsl(var(--success))' };
    }
  };

  const getStageLabel = (stage: string) => {
    return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Computed stats
  const totalCustomers = customers.length;
  const inProgress = customers.filter(c => c.onboardingStage !== 'COMPLETE').length;
  const highRisk = customers.filter(c => c.overallRiskLevel === 'HIGH' || c.overallRiskLevel === 'CRITICAL').length;
  const fullyVerified = customers.filter(c => c.onboardingStage === 'COMPLETE').length;

  const filtered = filter === 'ALL'
    ? customers
    : customers.filter(c => c.overallRiskLevel === filter);

  const FILTER_OPTIONS: FilterOption[] = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading KYC data...</p>
      </div>
    );
  }

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>KYC Onboarding</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            Track customer due diligence progress and risk assessments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary">
            <UserPlus size={16} style={{ marginRight: '8px' }} />
            New Customer
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'hsla(var(--primary-transparent))' }}>
              <Users size={20} color="hsl(var(--primary))" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--text-primary))' }}>{totalCustomers}</div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Total Customers</div>
            </div>
          </div>
        </Card>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'hsla(var(--primary-transparent))' }}>
              <Users size={20} color="hsl(var(--primary))" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{inProgress}</div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>In Progress</div>
            </div>
          </div>
        </Card>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'hsla(var(--error) / 0.1)' }}>
              <AlertTriangle size={20} color="hsl(var(--error))" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--error))' }}>{highRisk}</div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>High / Critical Risk</div>
            </div>
          </div>
        </Card>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'hsla(var(--success) / 0.1)' }}>
              <CheckCircle size={20} color="hsl(var(--success))" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--success))' }}>{fullyVerified}</div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Fully Verified</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {FILTER_OPTIONS.map(opt => {
          const isActive = filter === opt;
          return (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: isActive ? '1px solid hsl(var(--primary))' : '1px solid hsla(var(--border))',
                backgroundColor: isActive ? 'hsla(var(--primary-transparent))' : 'transparent',
                color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {opt === 'ALL' ? 'All' : opt}
            </button>
          );
        })}
      </div>

      {/* Customer Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                <th style={{ padding: '16px', fontWeight: 500 }}>Customer</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Type</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Tranche</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Jurisdiction</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Risk</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Progress</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Stage</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => {
                const riskStyle = getRiskStyle(customer.overallRiskLevel);
                return (
                  <tr key={customer.id} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{customer.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{customer.id}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
                      {customer.entityType}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: customer.tranche === 'Tranche 2' ? 'hsla(var(--primary-transparent))' : 'hsla(var(--bg-elevated))',
                        color: customer.tranche === 'Tranche 2' ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
                        border: customer.tranche === 'Tranche 2' ? '1px solid hsla(var(--primary) / 0.3)' : '1px solid hsla(var(--border))',
                      }}>
                        {customer.tranche}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
                      {customer.jurisdiction}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: riskStyle.bg,
                        color: riskStyle.color,
                      }}>
                        {customer.overallRiskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <OnboardingProgress stage={customer.onboardingStage} progress={customer.onboardingProgress} compact />
                    </td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.8rem' }}>
                      {getStageLabel(customer.onboardingStage)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/kyc/${customer.id}`)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                    No customers match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
