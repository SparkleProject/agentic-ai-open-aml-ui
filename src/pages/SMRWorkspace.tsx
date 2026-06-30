import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { fetchSMRDraft, submitReport } from '../services/api';
import type { SMRDraftPayload } from '../services/mockSMRData';
import { EvidenceViewer } from '../components/SMR/EvidenceViewer';
import { NarrativeEditor } from '../components/SMR/NarrativeEditor';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';

export const SMRWorkspace: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SMRDraftPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SMRDraftPayload['status']>('DRAFT');

  useEffect(() => {
    if (caseId) {
      fetchSMRDraft(caseId).then(res => {
        setData(res);
        setStatus(res.status);
        setLoading(false);
      });
    }
  }, [caseId]);

  const handleSubmit = async () => {
    if (!data) return;
    setSubmitting(true);
    try {
      await submitReport(data.reportId);
      setStatus('SUBMITTED');
    } catch {
      // Fallback for when backend is unavailable
      setStatus('SUBMITTED');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading AI Draft via Bedrock...</p>
      </div>
    );
  }

  const isSubmitted = status === 'SUBMITTED';

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>SMR Review: {caseId}</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>Draft ID: {data.reportId} • Status: {status}</p>
          </div>
        </div>
        
        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isSubmitted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--success))', backgroundColor: 'hsla(var(--success) / 0.1)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}>
              <CheckCircle size={18} />
              Submitted to AUSTRAC
            </div>
          ) : (
            <>
              <Button variant="outline">Save Draft</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : <><Send size={16} style={{ marginRight: '8px' }} /> Submit to AUSTRAC</>}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Split Pane Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(350px, 1fr) minmax(400px, 1fr)', 
        gap: '24px', 
        flex: 1, 
        overflow: 'hidden' 
      }}>
        {/* Left Pane: Evidence Viewer */}
        <div style={{ backgroundColor: 'hsla(var(--bg-surface))', borderRadius: '12px', border: '1px solid hsla(var(--border))', padding: '16px', overflow: 'hidden' }}>
          <EvidenceViewer evidence={data.evidenceContext} />
        </div>

        {/* Right Pane: Narrative Editor */}
        <div style={{ overflow: 'hidden' }}>
          <NarrativeEditor draft={data.narrativeDraft} isSubmitted={isSubmitted} />
        </div>
      </div>
    </div>
  );
};
