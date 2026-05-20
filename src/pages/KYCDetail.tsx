import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { RiskScoreGauge } from '../components/KYC/RiskScoreGauge';
import { VerificationBadge } from '../components/KYC/VerificationBadge';
import { CDDChecklist } from '../components/KYC/CDDChecklist';
import { RiskBreakdownChart } from '../components/KYC/RiskBreakdownChart';
import { OnboardingProgress } from '../components/KYC/OnboardingProgress';
import { ArrowLeft, Play, Download } from 'lucide-react';
import { fetchMockKYCCustomer, type KYCCustomer } from '../services/mockKYCData';

export const KYCDetail: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<KYCCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetchMockKYCCustomer(customerId).then(data => {
        setCustomer(data);
        setLoading(false);
      });
    }
  }, [customerId]);

  if (loading || !customer) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading customer profile...</p>
      </div>
    );
  }

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="ghost" onClick={() => navigate('/kyc')} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{customer.name}</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
              {customer.entityType} • {customer.industry} • {customer.jurisdiction} • {customer.tranche}
              <span style={{ marginLeft: '8px', color: 'hsl(var(--text-muted))' }}>({customer.id})</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline">
            <Download size={16} style={{ marginRight: '8px' }} />
            Export CDD Report
          </Button>
          <Button variant="primary">
            <Play size={16} style={{ marginRight: '8px' }} />
            Run Full Screening
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px' }}>
          {/* Risk Score Gauge */}
          <RiskScoreGauge score={customer.overallRiskScore} riskLevel={customer.overallRiskLevel} />

          {/* Risk Breakdown Chart */}
          <RiskBreakdownChart breakdown={customer.riskBreakdown} />

          {/* Verification Status */}
          <Card title="Verification Status">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <VerificationBadge label="Identity Verification" status={customer.identityVerification} />
              <VerificationBadge label="PEP Screening" status={customer.pepScreening} />
              <VerificationBadge label="Sanctions Screening" status={customer.sanctionsScreening} />
              <VerificationBadge label="Adverse Media" status={customer.adverseMedia} />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px' }}>
          {/* Onboarding Progress */}
          <Card title="Onboarding Progress" description={`${customer.onboardingProgress}% complete`}>
            <div style={{ padding: '8px 0' }}>
              <OnboardingProgress stage={customer.onboardingStage} progress={customer.onboardingProgress} />
            </div>
          </Card>

          {/* CDD Checklist */}
          <CDDChecklist items={customer.cddChecklist} />
        </div>
      </div>
    </div>
  );
};
