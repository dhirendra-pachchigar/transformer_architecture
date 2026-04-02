import React from 'react';
import { NodeType } from '../types';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const transformerComponents = [
  { type: 'TokenInput' as NodeType, label: '📥 Token Input', category: 'Input Pipeline' },
  { type: 'Tokenizer' as NodeType, label: '🔤 Tokenizer', category: 'Input Pipeline' },
  { type: 'InputEmbedding' as NodeType, label: '🔢 Input Embedding', category: 'Input Pipeline' },
  { type: 'PositionalEncoding' as NodeType, label: '📍 Positional Encoding', category: 'Input Pipeline' },
  { type: 'QueryProjection' as NodeType, label: '❓ Q Projection', category: 'Attention' },
  { type: 'KeyProjection' as NodeType, label: '🔑 K Projection', category: 'Attention' },
  { type: 'ValueProjection' as NodeType, label: '💎 V Projection', category: 'Attention' },
  { type: 'ScaledDotProduct' as NodeType, label: '⚖️ Scaled Dot-Product', category: 'Attention' },
  { type: 'AttentionScore' as NodeType, label: '📊 Attention Score', category: 'Attention' },
  { type: 'Softmax' as NodeType, label: '🔥 Softmax', category: 'Attention' },
  { type: 'WeightedSum' as NodeType, label: '∑ Weighted Sum', category: 'Attention' },
  { type: 'MultiHeadConcat' as NodeType, label: '🔗 Multi-Head Concat', category: 'Attention' },
  { type: 'FinalLinearProjection' as NodeType, label: '➡️ Final Linear', category: 'Attention' },
  { type: 'MultiHeadAttention' as NodeType, label: '🧠 Multi-Head Attention', category: 'Encoder' },
  { type: 'AddNorm' as NodeType, label: '➕ Add & Norm', category: 'Encoder' },
  { type: 'FeedForward' as NodeType, label: '🍽️ Feed Forward', category: 'Encoder' },
  { type: 'MaskedMultiHeadAttention' as NodeType, label: '🎭 Masked MHA', category: 'Decoder' },
  { type: 'EncoderDecoderAttention' as NodeType, label: '🔄 Enc-Dec Attention', category: 'Decoder' },
  { type: 'LinearLayer' as NodeType, label: '📐 Linear Layer', category: 'Output' },
  { type: 'OutputTokens' as NodeType, label: '📤 Output Tokens', category: 'Output' },
];

const nnComponents = [
  { type: 'NNInput' as NodeType, label: '📥 Input Layer', category: 'Neural Network' },
  { type: 'DenseLayer' as NodeType, label: '🔷 Dense Layer', category: 'Neural Network' },
  { type: 'NNOutput' as NodeType, label: '📤 Output Layer', category: 'Neural Network' },
];

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  return (
    <div
      style={{
        width: '280px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        overflowY: 'auto',
        padding: '16px',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
        🧩 Components
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
          Transformer Blocks
        </h3>
        
        {['Input Pipeline', 'Attention', 'Encoder', 'Decoder', 'Output'].map((category) => (
          <div key={category} style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' }}>
              {category}
            </h4>
            {transformerComponents
              .filter((c) => c.category === category)
              .map((component) => (
                <div
                  key={component.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, component.type)}
                  style={{
                    padding: '10px 12px',
                    marginBottom: '6px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'grab',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {component.label}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
          Neural Network
        </h3>
        {nnComponents.map((component) => (
          <div
            key={component.type}
            draggable
            onDragStart={(e) => onDragStart(e, component.type)}
            style={{
              padding: '10px 12px',
              marginBottom: '6px',
              background: '#fdf2f8',
              border: '1px solid #fbcfe8',
              borderRadius: '6px',
              cursor: 'grab',
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fce7f3';
              e.currentTarget.style.borderColor = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fdf2f8';
              e.currentTarget.style.borderColor = '#fbcfe8';
            }}
          >
            {component.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
