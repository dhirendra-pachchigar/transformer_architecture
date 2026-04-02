import React from 'react';
import { useStore } from '../store/useStore';
import { NodeData, ActivationType } from '../types';

interface NodeConfigPanelProps {
  nodeId: string | null;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ nodeId }) => {
  const { nodes, updateNode } = useStore();
  
  const node = nodes.find(n => n.id === nodeId);
  if (!node || !nodeId) return null;

  const data = node.data as unknown as NodeData;

  const handleConfigChange = (key: string, value: number | string) => {
    updateNode(nodeId, {
      config: {
        ...data.config,
        [key]: value,
      },
    });
  };

  const activations: ActivationType[] = ['ReLU', 'Sigmoid', 'Tanh', 'Softmax', 'LeakyReLU', 'None'];

  return (
    <div
      style={{
        width: '280px',
        background: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
        ⚙️ Configuration
      </h2>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
          Node Type
        </label>
        <div
          style={{
            padding: '8px 12px',
            background: '#f1f5f9',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#1e293b',
            fontFamily: 'monospace',
          }}
        >
          {data.nodeType}
        </div>
      </div>

      {data.config.neurons !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Neurons / Features
          </label>
          <input
            type="number"
            value={data.config.neurons}
            onChange={(e) => handleConfigChange('neurons', parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>
      )}

      {data.config.d_model !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            d_model (Embedding Dim)
          </label>
          <input
            type="number"
            value={data.config.d_model}
            onChange={(e) => handleConfigChange('d_model', parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>
      )}

      {data.config.num_heads !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Number of Heads
          </label>
          <input
            type="number"
            value={data.config.num_heads}
            onChange={(e) => handleConfigChange('num_heads', parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>
      )}

      {data.config.seq_len !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Sequence Length
          </label>
          <input
            type="number"
            value={data.config.seq_len}
            onChange={(e) => handleConfigChange('seq_len', parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>
      )}

      {data.config.batch_size !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Batch Size
          </label>
          <input
            type="number"
            value={data.config.batch_size}
            onChange={(e) => handleConfigChange('batch_size', parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>
      )}

      {data.config.dropout !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Dropout Rate
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={data.config.dropout}
            onChange={(e) => handleConfigChange('dropout', parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          />
        </div>
      )}

      {data.config.activation !== undefined && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Activation Function
          </label>
          <select
            value={data.config.activation}
            onChange={(e) => handleConfigChange('activation', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '13px',
              background: 'white',
            }}
          >
            {activations.map(activation => (
              <option key={activation} value={activation}>
                {activation}
              </option>
            ))}
          </select>
        </div>
      )}

      {data.tensorShape && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Output Tensor Shape
          </label>
          <div
            style={{
              padding: '8px 12px',
              background: '#fef3c7',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#92400e',
              fontFamily: 'monospace',
            }}
          >
            {data.tensorShape}
          </div>
        </div>
      )}

      {data.mathFormula && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            Mathematical Formula
          </label>
          <div
            style={{
              padding: '8px 12px',
              background: '#dbeafe',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#1e40af',
              fontFamily: 'monospace',
              fontStyle: 'italic',
            }}
          >
            {data.mathFormula}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeConfigPanel;
