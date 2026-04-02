import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeType } from '../types';

interface CustomNodeData {
  nodeType: NodeType;
  label: string;
  description?: string;
  config: Record<string, unknown>;
  tensorShape?: string;
  mathFormula?: string;
  isValid?: boolean;
  errorMessage?: string;
}

const getNodeColor = (nodeType: NodeType): string => {
  const transformerInputNodes: NodeType[] = ['TokenInput', 'Tokenizer', 'InputEmbedding', 'PositionalEncoding'];
  const attentionNodes: NodeType[] = ['QueryProjection', 'KeyProjection', 'ValueProjection', 'ScaledDotProduct', 'AttentionScore', 'Softmax', 'WeightedSum', 'MultiHeadConcat', 'FinalLinearProjection'];
  const encoderNodes: NodeType[] = ['MultiHeadAttention', 'AddNorm', 'FeedForward', 'EncoderBlock'];
  const decoderNodes: NodeType[] = ['MaskedMultiHeadAttention', 'EncoderDecoderAttention', 'DecoderBlock'];
  const outputNodes: NodeType[] = ['LinearLayer', 'OutputTokens'];
  const nnNodes: NodeType[] = ['NNInput', 'DenseLayer', 'NNOutput'];

  if (transformerInputNodes.includes(nodeType)) return '#3b82f6';
  if (attentionNodes.includes(nodeType)) return '#8b5cf6';
  if (encoderNodes.includes(nodeType)) return '#10b981';
  if (decoderNodes.includes(nodeType)) return '#f59e0b';
  if (outputNodes.includes(nodeType)) return '#ef4444';
  if (nnNodes.includes(nodeType)) return '#ec4899';
  return '#64748b';
};

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const color = getNodeColor(data.nodeType);

  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'white',
        borderRadius: '8px',
        border: `2px solid ${selected ? '#3b82f6' : color}`,
        minWidth: '180px',
        maxWidth: '280px',
        boxShadow: selected 
          ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: color, width: '10px', height: '10px' }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: color,
          }}
        />
        <strong style={{ fontSize: '14px', color: '#1e293b' }}>{data.label}</strong>
      </div>

      {data.tensorShape && (
        <div
          style={{
            fontSize: '11px',
            color: '#64748b',
            background: '#f1f5f9',
            padding: '4px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            marginBottom: '6px',
          }}
        >
          Shape: {data.tensorShape}
        </div>
      )}

      {data.mathFormula && (
        <div
          style={{
            fontSize: '10px',
            color: '#475569',
            fontStyle: 'italic',
            background: '#fef3c7',
            padding: '4px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          {data.mathFormula}
        </div>
      )}

      {!data.isValid && data.errorMessage && (
        <div
          style={{
            fontSize: '10px',
            color: '#dc2626',
            background: '#fee2e2',
            padding: '4px 8px',
            borderRadius: '4px',
            marginTop: '6px',
          }}
        >
          ⚠️ {data.errorMessage}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: color, width: '10px', height: '10px' }}
      />
    </div>
  );
};

export default memo(CustomNode);
