import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  type Node,
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { EntityNode } from './EntityNode';
import { EntityDetailPanel } from './EntityDetailPanel';
import { getLayoutedElements } from './graphLayoutUtils';
import { fetchCorporateStructure } from '../../../services/api';
import type { CorporateEntity } from '../../../services/mockCorporateData';

const nodeTypes = {
  entity: EntityNode,
};

interface CorporateVisualiserProps {
  customerId: string;
}

export const CorporateVisualiser: React.FC<CorporateVisualiserProps> = ({ customerId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<CorporateEntity | null>(null);

  // Load and layout data
  useEffect(() => {
    fetchCorporateStructure(customerId).then((data) => {
      const initialNodes: Node[] = data.entities.map(ent => ({
        id: ent.id,
        type: 'entity',
        data: ent as unknown as Record<string, unknown>,
        position: { x: 0, y: 0 }
      }));

      const initialEdges: Edge[] = data.relationships.map(rel => ({
        id: rel.id,
        source: rel.sourceId,
        target: rel.targetId,
        label: rel.percentage ? `${rel.type} (${rel.percentage}%)` : rel.type,
        type: 'smoothstep',
        animated: rel.type === 'TRUSTEE',
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeOpacity: 1 },
        labelStyle: { fill: 'hsl(var(--text-secondary))', fontWeight: 600, fontSize: 12 },
        labelBgStyle: { fill: 'hsl(var(--background))', fillOpacity: 0.8 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))',
        },
        data: { originalType: rel.type }
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLoading(false);
    });
  }, [customerId, setNodes, setEdges]);

  // Update edge styles based on selection
  useEffect(() => {
    setEdges(eds => 
      eds.map(edge => {
        if (!selectedEntity) {
          return {
            ...edge,
            style: { ...edge.style, stroke: 'hsl(var(--primary))', strokeOpacity: 1, strokeWidth: 2 },
            animated: edge.data?.originalType === 'TRUSTEE',
            markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' },
          };
        }

        const isConnected = edge.source === selectedEntity.id || edge.target === selectedEntity.id;
        const color = isConnected ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))';
        const opacity = isConnected ? 1 : 0.2;
        
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: color,
            strokeOpacity: opacity,
            strokeWidth: isConnected ? 3 : 1
          },
          animated: isConnected || edge.data?.originalType === 'TRUSTEE',
          markerEnd: { type: MarkerType.ArrowClosed, color },
        };
      })
    );
  }, [selectedEntity, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedEntity(node.data as unknown as CorporateEntity);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'hsl(var(--background))' }}>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading corporate structure...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedEntity(null)}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          style={{ backgroundColor: 'var(--background)' }}
        >
          <Background color="hsl(var(--border))" gap={16} />
          <Controls 
            style={{ 
              backgroundColor: 'hsla(var(--bg-elevated))', 
              boxShadow: '0 4px 12px hsla(var(--background)/0.5)',
              border: '1px solid hsla(var(--border))',
              borderRadius: '8px'
            }} 
          />
          <MiniMap 
            nodeColor={(node) => {
              const data = node.data as unknown as CorporateEntity;
              if (data.riskLevel === 'CRITICAL' || data.riskLevel === 'HIGH') return 'hsl(var(--error))';
              if (data.riskLevel === 'MEDIUM') return 'hsl(var(--warning))';
              return 'hsl(var(--success))';
            }}
            maskColor="hsla(var(--background) / 0.7)"
            style={{ 
              backgroundColor: 'hsla(var(--bg-elevated))',
              border: '1px solid hsla(var(--border))',
              borderRadius: '8px'
            }}
          />
        </ReactFlow>
      </div>

      {selectedEntity && (
        <EntityDetailPanel 
          entity={selectedEntity} 
          onClose={() => setSelectedEntity(null)} 
        />
      )}
    </div>
  );
};
