import React, { useState, useEffect, useMemo } from 'react';
import { Database, Download } from 'lucide-react';
import { Button } from '../components/Button/Button';
import { AuditFilterBar } from '../components/ResponsibleAI/AuditFilterBar';
import { AuditTrailTable } from '../components/ResponsibleAI/AuditTrailTable';
import { AuditDetailPanel } from '../components/ResponsibleAI/AuditDetailPanel';
import { fetchAuditLogs } from '../services/api';
import type { AuditLogEntry } from '../services/mockAuditTrailData';

export const AuditTrailExplorer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Selection state
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    fetchAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.agentId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesModel = modelFilter ? log.modelId === modelFilter : true;
      const matchesStatus = statusFilter ? log.status === statusFilter : true;
      
      return matchesSearch && matchesModel && matchesStatus;
    });
  }, [logs, searchTerm, modelFilter, statusFilter]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'hsla(var(--primary-transparent))' }}>
              <Database size={28} color="hsl(var(--primary))" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                Audit Trail Explorer
              </h1>
              <p style={{ margin: '4px 0 0 0', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
                ISO 42001 governance logs for AI decisions.
              </p>
            </div>
          </div>
          <div>
            <Button variant="outline" onClick={() => alert('Exporting to CSV...')}>
              <Download size={16} style={{ marginRight: '8px' }} />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Filters */}
        <AuditFilterBar 
          onSearch={setSearchTerm}
          onModelChange={setModelFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Data Table */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
            Loading audit trails...
          </div>
        ) : (
          <AuditTrailTable 
            logs={filteredLogs} 
            onInspect={setSelectedLog} 
            selectedId={selectedLog?.id}
          />
        )}
      </div>

      {/* Side Panel for Details */}
      {selectedLog && (
        <AuditDetailPanel 
          log={selectedLog} 
          onClose={() => setSelectedLog(null)} 
        />
      )}
      
    </div>
  );
};
