import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { NodeType, ActivationType } from '../types';

interface ArchitectureState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  showCode: boolean;
  mode: 'transformer' | 'neural' | 'hybrid';
  
  // Actions
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<Node['data']>) => void;
  removeNode: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (id: string | null) => void;
  toggleCode: () => void;
  setMode: (mode: 'transformer' | 'neural' | 'hybrid') => void;
  clearCanvas: () => void;
  loadTemplate: (template: 'bert' | 'gpt' | 'mlp') => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

const getDefaultNodeData = (type: NodeType) => {
  const baseConfig = {
    batch_size: 32,
    seq_len: 512,
    d_model: 512,
    num_heads: 8,
    neurons: 128,
    activation: 'ReLU' as ActivationType,
    dropout: 0.1,
  };

  switch (type) {
    case 'TokenInput':
      return { label: 'Token Input', config: { ...baseConfig }, tensorShape: '(batch, seq_len)', mathFormula: 'x ∈ ℕ^{{batch_size}×{seq_len}}' };
    case 'Tokenizer':
      return { label: 'Tokenizer', config: { ...baseConfig }, tensorShape: '(batch, seq_len)', mathFormula: 'tokenize(x)' };
    case 'InputEmbedding':
      return { label: 'Input Embedding', config: { ...baseConfig, d_model: 512 }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'E(x) ∈ ℝ^{{batch_size}×{seq_len}×{d_model}}' };
    case 'PositionalEncoding':
      return { label: 'Positional Encoding', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'PE(pos, i) = sin/cos(pos/10000^{2i/d_model})' };
    case 'QueryProjection':
      return { label: 'Q Projection', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'Q = XW^Q' };
    case 'KeyProjection':
      return { label: 'K Projection', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'K = XW^K' };
    case 'ValueProjection':
      return { label: 'V Projection', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'V = XW^V' };
    case 'ScaledDotProduct':
      return { label: 'Scaled Dot-Product', config: { ...baseConfig }, tensorShape: '(batch, heads, seq_len, seq_len)', mathFormula: 'Attention(Q,K,V) = softmax(QK^T/√d_k)V' };
    case 'AttentionScore':
      return { label: 'Attention Score', config: { ...baseConfig }, tensorShape: '(batch, heads, seq_len, seq_len)', mathFormula: 'Scores = QK^T/√d_k' };
    case 'Softmax':
      return { label: 'Softmax', config: { ...baseConfig }, tensorShape: '(batch, heads, seq_len, seq_len)', mathFormula: 'softmax(x)_i = e^{x_i}/Σe^{x_j}' };
    case 'WeightedSum':
      return { label: 'Weighted Sum', config: { ...baseConfig }, tensorShape: '(batch, heads, seq_len, d_model)', mathFormula: 'Output = Attention·V' };
    case 'MultiHeadConcat':
      return { label: 'Multi-Head Concat', config: { ...baseConfig }, tensorShape: '(batch, seq_len, num_heads×d_model)', mathFormula: 'Concat(head_1,...,head_h)' };
    case 'FinalLinearProjection':
      return { label: 'Final Linear', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'Y = Concat·W^O' };
    case 'MultiHeadAttention':
      return { label: 'Multi-Head Attention', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'MHA(X) = Concat(heads)W^O' };
    case 'AddNorm':
      return { label: 'Add & Norm', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'LayerNorm(x + Sublayer(x))' };
    case 'FeedForward':
      return { label: 'Feed Forward', config: { ...baseConfig, neurons: 2048 }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'FFN(x) = ReLU(xW_1+b_1)W_2+b_2' };
    case 'EncoderBlock':
      return { label: 'Encoder Block', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'EncoderBlock(x)' };
    case 'MaskedMultiHeadAttention':
      return { label: 'Masked MHA', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'MaskedMHA(X) with causal mask' };
    case 'EncoderDecoderAttention':
      return { label: 'Enc-Dec Attention', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'CrossAttn(Q_dec, K_enc, V_enc)' };
    case 'DecoderBlock':
      return { label: 'Decoder Block', config: { ...baseConfig }, tensorShape: '(batch, seq_len, d_model)', mathFormula: 'DecoderBlock(x, enc_out)' };
    case 'LinearLayer':
      return { label: 'Linear Layer', config: { ...baseConfig, neurons: 512 }, tensorShape: '(batch, seq_len, vocab_size)', mathFormula: 'y = xW + b' };
    case 'OutputTokens':
      return { label: 'Output Tokens', config: { ...baseConfig }, tensorShape: '(batch, seq_len)', mathFormula: 'argmax(softmax(y))' };
    case 'NNInput':
      return { label: 'Input Layer', config: { ...baseConfig, neurons: 784 }, tensorShape: '(batch, input_features)', mathFormula: 'x ∈ ℝ^{{batch_size}×{input_features}}' };
    case 'DenseLayer':
      return { label: 'Dense Layer', config: { ...baseConfig, neurons: 128, activation: 'ReLU' }, tensorShape: '(batch, neurons)', mathFormula: 'y = activation(xW + b)' };
    case 'NNOutput':
      return { label: 'Output Layer', config: { ...baseConfig, neurons: 10, activation: 'Softmax' }, tensorShape: '(batch, output_classes)', mathFormula: 'ŷ = softmax(xW + b)' };
    default:
      return { label: type, config: baseConfig };
  }
};

export const useStore = create<ArchitectureState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  showCode: false,
  mode: 'transformer',
  
  addNode: (type, position) => {
    const id = `${type}-${Date.now()}`;
    const nodeData = getDefaultNodeData(type);
    
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id,
          type: 'custom',
          position,
          data: {
            nodeType: type,
            ...nodeData,
          },
        },
      ],
    }));
  },
  
  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }));
  },
  
  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    }));
  },
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (id) => set({ selectedNode: id }),
  toggleCode: () => set((state) => ({ showCode: !state.showCode })),
  setMode: (mode) => set({ mode }),
  
  clearCanvas: () => set({ nodes: [], edges: [], selectedNode: null }),
  
  loadTemplate: (template) => {
    const templates = {
      bert: {
        nodes: [
          { id: '1', type: 'custom', position: { x: 100, y: 100 }, data: { nodeType: 'TokenInput', ...getDefaultNodeData('TokenInput') } },
          { id: '2', type: 'custom', position: { x: 100, y: 250 }, data: { nodeType: 'InputEmbedding', ...getDefaultNodeData('InputEmbedding') } },
          { id: '3', type: 'custom', position: { x: 100, y: 400 }, data: { nodeType: 'PositionalEncoding', ...getDefaultNodeData('PositionalEncoding') } },
          { id: '4', type: 'custom', position: { x: 100, y: 550 }, data: { nodeType: 'MultiHeadAttention', ...getDefaultNodeData('MultiHeadAttention') } },
          { id: '5', type: 'custom', position: { x: 100, y: 700 }, data: { nodeType: 'AddNorm', ...getDefaultNodeData('AddNorm') } },
          { id: '6', type: 'custom', position: { x: 100, y: 850 }, data: { nodeType: 'FeedForward', ...getDefaultNodeData('FeedForward') } },
          { id: '7', type: 'custom', position: { x: 100, y: 1000 }, data: { nodeType: 'AddNorm', ...getDefaultNodeData('AddNorm') } },
          { id: '8', type: 'custom', position: { x: 100, y: 1150 }, data: { nodeType: 'LinearLayer', ...getDefaultNodeData('LinearLayer') } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e5-6', source: '5', target: '6' },
          { id: 'e6-7', source: '6', target: '7' },
          { id: 'e7-8', source: '7', target: '8' },
        ],
      },
      gpt: {
        nodes: [
          { id: '1', type: 'custom', position: { x: 100, y: 100 }, data: { nodeType: 'TokenInput', ...getDefaultNodeData('TokenInput') } },
          { id: '2', type: 'custom', position: { x: 100, y: 250 }, data: { nodeType: 'InputEmbedding', ...getDefaultNodeData('InputEmbedding') } },
          { id: '3', type: 'custom', position: { x: 100, y: 400 }, data: { nodeType: 'PositionalEncoding', ...getDefaultNodeData('PositionalEncoding') } },
          { id: '4', type: 'custom', position: { x: 100, y: 550 }, data: { nodeType: 'MaskedMultiHeadAttention', ...getDefaultNodeData('MaskedMultiHeadAttention') } },
          { id: '5', type: 'custom', position: { x: 100, y: 700 }, data: { nodeType: 'AddNorm', ...getDefaultNodeData('AddNorm') } },
          { id: '6', type: 'custom', position: { x: 100, y: 850 }, data: { nodeType: 'FeedForward', ...getDefaultNodeData('FeedForward') } },
          { id: '7', type: 'custom', position: { x: 100, y: 1000 }, data: { nodeType: 'AddNorm', ...getDefaultNodeData('AddNorm') } },
          { id: '8', type: 'custom', position: { x: 100, y: 1150 }, data: { nodeType: 'LinearLayer', ...getDefaultNodeData('LinearLayer') } },
          { id: '9', type: 'custom', position: { x: 100, y: 1300 }, data: { nodeType: 'OutputTokens', ...getDefaultNodeData('OutputTokens') } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
          { id: 'e3-4', source: '3', target: '4' },
          { id: 'e4-5', source: '4', target: '5' },
          { id: 'e5-6', source: '5', target: '6' },
          { id: 'e6-7', source: '6', target: '7' },
          { id: 'e7-8', source: '7', target: '8' },
          { id: 'e8-9', source: '8', target: '9' },
        ],
      },
      mlp: {
        nodes: [
          { id: '1', type: 'custom', position: { x: 100, y: 100 }, data: { nodeType: 'NNInput', ...getDefaultNodeData('NNInput') } },
          { id: '2', type: 'custom', position: { x: 100, y: 250 }, data: { nodeType: 'DenseLayer', ...getDefaultNodeData('DenseLayer') } },
          { id: '3', type: 'custom', position: { x: 100, y: 400 }, data: { nodeType: 'DenseLayer', ...getDefaultNodeData('DenseLayer') } },
          { id: '4', type: 'custom', position: { x: 100, y: 550 }, data: { nodeType: 'NNOutput', ...getDefaultNodeData('NNOutput') } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
          { id: 'e3-4', source: '3', target: '4' },
        ],
      },
    };
    
    set(templates[template]);
  },
  
  exportJSON: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },
  
  importJSON: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      set({ nodes, edges });
    } catch (e) {
      console.error('Failed to import JSON:', e);
    }
  },
}));
