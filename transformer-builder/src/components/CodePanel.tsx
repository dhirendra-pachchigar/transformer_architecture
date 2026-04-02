import React from 'react';
import Editor from '@monaco-editor/react';
import { generatePyTorchCode } from '../utils/codeGenerator';
import { Node, Edge } from 'reactflow';

interface CodePanelProps {
  nodes: Node[];
  edges: Edge[];
  isOpen: boolean;
  onClose: () => void;
}

const CodePanel: React.FC<CodePanelProps> = ({ nodes, edges, isOpen, onClose }) => {
  const code = generatePyTorchCode(nodes, edges);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40vh',
        background: '#1e293b',
        borderTop: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: '#0f172a',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>🐍</span>
          <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>
            Generated PyTorch Code
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '12px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          ✕ Hide
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodePanel;
