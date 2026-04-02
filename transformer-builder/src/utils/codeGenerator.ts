import { Node, Edge } from 'reactflow';
import { NodeType } from '../types';

interface NodeInfo {
  type: NodeType;
  id: string;
  data: Record<string, unknown>;
}

export const generatePyTorchCode = (nodes: Node[], edges: Edge[]): string => {
  if (nodes.length === 0) {
    return `# Drag and drop components to build your architecture\n# Then PyTorch code will be generated here automatically`;
  }

  const nodeInfos: NodeInfo[] = nodes.map(node => ({
    type: node.data.nodeType as NodeType,
    id: node.id,
    data: node.data,
  }));

  let imports = `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

`;

  let modelClass = `class TransformerArchitecture(nn.Module):
    def __init__(self, d_model=512, num_heads=8, num_layers=6, vocab_size=30522, max_seq_len=512, dropout=0.1):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        
`;

  let forwardMethod = `
    def forward(self, x):
        # Input shape: (batch_size, seq_len)
        
`;

  let layerCounter = 0;
  const nodeMap = new Map<string, NodeInfo>();
  const edgeMap = new Map<string, string[]>();

  nodeInfos.forEach(node => nodeMap.set(node.id, node));

  edges.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source)!.push(edge.target);
  });

  // Find input nodes
  const inputNodes = nodeInfos.filter(n => 
    ['TokenInput', 'NNInput', 'InputEmbedding'].includes(n.type)
  );

  // Generate component definitions
  nodeInfos.forEach(node => {
    const config = node.data.config as Record<string, unknown> || {};
    
    switch (node.type) {
      case 'InputEmbedding':
        modelClass += `        self.embedding_${layerCounter} = nn.Embedding(vocab_size, d_model)\n`;
        layerCounter++;
        break;
      
      case 'PositionalEncoding':
        modelClass += `        self.pos_encoder = PositionalEncoding(d_model, dropout, max_seq_len)\n`;
        break;
      
      case 'MultiHeadAttention':
        modelClass += `        self.attention_${layerCounter} = nn.MultiheadAttention(d_model, num_heads, dropout=${config.dropout || 0.1}, batch_first=True)\n`;
        modelClass += `        self.norm_${layerCounter}_1 = nn.LayerNorm(d_model)\n`;
        layerCounter++;
        break;
      
      case 'FeedForward':
        const ffDim = (config.neurons as number) || 2048;
        modelClass += `        self.ffn_${layerCounter} = nn.Sequential(\n`;
        modelClass += `            nn.Linear(d_model, ${ffDim}),\n`;
        modelClass += `            nn.ReLU(),\n`;
        modelClass += `            nn.Dropout(${config.dropout || 0.1}),\n`;
        modelClass += `            nn.Linear(${ffDim}, d_model),\n`;
        modelClass += `        )\n`;
        modelClass += `        self.norm_${layerCounter}_2 = nn.LayerNorm(d_model)\n`;
        layerCounter++;
        break;
      
      case 'AddNorm':
        modelClass += `        self.norm_${layerCounter} = nn.LayerNorm(d_model)\n`;
        layerCounter++;
        break;
      
      case 'MaskedMultiHeadAttention':
        modelClass += `        self.masked_attention_${layerCounter} = nn.MultiheadAttention(d_model, num_heads, dropout=${config.dropout || 0.1}, batch_first=True)\n`;
        layerCounter++;
        break;
      
      case 'EncoderDecoderAttention':
        modelClass += `        self.cross_attention_${layerCounter} = nn.MultiheadAttention(d_model, num_heads, dropout=${config.dropout || 0.1}, batch_first=True)\n`;
        layerCounter++;
        break;
      
      case 'LinearLayer':
        const outFeatures = (config.neurons as number) || 512;
        modelClass += `        self.linear_${layerCounter} = nn.Linear(d_model, ${outFeatures})\n`;
        layerCounter++;
        break;
      
      case 'DenseLayer':
        const neurons = (config.neurons as number) || 128;
        const activation = (config.activation as string) || 'ReLU';
        modelClass += `        self.dense_${layerCounter} = nn.Linear(input_dim, ${neurons})\n`;
        modelClass += `        self.activation_${layerCounter} = nn.${activation}()\n`;
        layerCounter++;
        break;
      
      case 'QueryProjection':
        modelClass += `        self.W_q = nn.Linear(d_model, d_model)\n`;
        break;
      
      case 'KeyProjection':
        modelClass += `        self.W_k = nn.Linear(d_model, d_model)\n`;
        break;
      
      case 'ValueProjection':
        modelClass += `        self.W_v = nn.Linear(d_model, d_model)\n`;
        break;
      
      case 'Softmax':
        // Softmax is functional, no module needed
        break;
      
      case 'OutputTokens':
        modelClass += `        self.output_layer = nn.Linear(d_model, vocab_size)\n`;
        break;
      
      case 'NNInput':
        const inputFeatures = (config.neurons as number) || 784;
        modelClass += `        self.input_dim = ${inputFeatures}\n`;
        break;
      
      case 'NNOutput':
        const outputClasses = (config.neurons as number) || 10;
        modelClass += `        self.output_layer = nn.Linear(last_dim, ${outputClasses})\n`;
        break;
    }
  });

  // Generate forward pass
  let forwardCounter = 0;
  const hasTransformer = nodeInfos.some(n => 
    ['MultiHeadAttention', 'FeedForward', 'PositionalEncoding', 'InputEmbedding'].includes(n.type)
  );
  
  const hasNN = nodeInfos.some(n => 
    ['DenseLayer', 'NNInput', 'NNOutput'].includes(n.type)
  );

  if (hasTransformer) {
    forwardMethod += `        batch_size, seq_len = x.shape\n`;
    forwardMethod += `        \n`;
  }

  nodeInfos.forEach(node => {
    const config = node.data.config as Record<string, unknown> || {};
    
    switch (node.type) {
      case 'InputEmbedding':
        forwardMethod += `        x = self.embedding_${forwardCounter}(x)  # (batch, seq_len, d_model)\n`;
        forwardCounter++;
        break;
      
      case 'PositionalEncoding':
        forwardMethod += `        x = self.pos_encoder(x)\n`;
        break;
      
      case 'MultiHeadAttention':
        forwardMethod += `        attn_output, _ = self.attention_${forwardCounter}(x, x, x)\n`;
        forwardMethod += `        x = self.norm_${forwardCounter}_1(x + attn_output)\n`;
        forwardCounter++;
        break;
      
      case 'FeedForward':
        forwardMethod += `        ffn_output = self.ffn_${forwardCounter}(x)\n`;
        forwardMethod += `        x = self.norm_${forwardCounter}_2(x + ffn_output)\n`;
        forwardCounter++;
        break;
      
      case 'AddNorm':
        forwardMethod += `        x = self.norm_${forwardCounter}(x)\n`;
        forwardCounter++;
        break;
      
      case 'MaskedMultiHeadAttention':
        forwardMethod += `        mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()\n`;
        forwardMethod += `        attn_output, _ = self.masked_attention_${forwardCounter}(x, x, x, attn_mask=mask)\n`;
        forwardCounter++;
        break;
      
      case 'EncoderDecoderAttention':
        forwardMethod += `        attn_output, _ = self.cross_attention_${forwardCounter}(x, encoder_output, encoder_output)\n`;
        forwardCounter++;
        break;
      
      case 'LinearLayer':
        forwardMethod += `        x = self.linear_${forwardCounter}(x)\n`;
        forwardCounter++;
        break;
      
      case 'DenseLayer':
        const activation = (config.activation as string) || 'ReLU';
        forwardMethod += `        x = self.dense_${forwardCounter}(x)\n`;
        forwardMethod += `        x = self.activation_${forwardCounter}(x)\n`;
        forwardCounter++;
        break;
      
      case 'QueryProjection':
        forwardMethod += `        Q = self.W_q(x)\n`;
        break;
      
      case 'KeyProjection':
        forwardMethod += `        K = self.W_k(x)\n`;
        break;
      
      case 'ValueProjection':
        forwardMethod += `        V = self.W_v(x)\n`;
        break;
      
      case 'ScaledDotProduct':
        forwardMethod += `        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_model)\n`;
        forwardMethod += `        attention = F.softmax(scores, dim=-1)\n`;
        forwardMethod += `        output = torch.matmul(attention, V)\n`;
        break;
      
      case 'Softmax':
        forwardMethod += `        x = F.softmax(x, dim=-1)\n`;
        break;
      
      case 'OutputTokens':
        forwardMethod += `        logits = self.output_layer(x)\n`;
        forwardMethod += `        output = torch.argmax(F.softmax(logits, dim=-1), dim=-1)\n`;
        break;
      
      case 'NNOutput':
        forwardMethod += `        x = self.output_layer(x)\n`;
        forwardMethod += `        output = F.softmax(x, dim=-1)\n`;
        break;
    }
  });

  if (hasTransformer) {
    forwardMethod += `        \n`;
    forwardMethod += `        return x\n`;
  } else if (hasNN) {
    forwardMethod += `        return output\n`;
  } else {
    forwardMethod += `        return x\n`;
  }

  // Add helper classes
  let helperClasses = `

class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, dropout: float = 0.1, max_len: int = 512):
        super().__init__()\n`;
  helperClasses += `        self.dropout = nn.Dropout(p=dropout)\n`;
  helperClasses += `        \n`;
  helperClasses += `        position = torch.arange(max_len).unsqueeze(1)\n`;
  helperClasses += `        div_term = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model))\n`;
  helperClasses += `        pe = torch.zeros(1, max_len, d_model)\n`;
  helperClasses += `        pe[0, :, 0::2] = torch.sin(position * div_term)\n`;
  helperClasses += `        pe[0, :, 1::2] = torch.cos(position * div_term)\n`;
  helperClasses += `        self.register_buffer('pe', pe)\n`;
  helperClasses += `    \n`;
  helperClasses += `    def forward(self, x):\n`;
  helperClasses += `        x = x + self.pe[:, :x.size(1)]\n`;
  helperClasses += `        return self.dropout(x)\n`;

  // Usage example
  const usageExample = `

# Example usage:
if __name__ == "__main__":
    model = TransformerArchitecture()
    
    # For transformer: input token IDs
    x = torch.randint(0, 30522, (32, 512))  # (batch_size, seq_len)
    output = model(x)
    print(f"Output shape: {output.shape}")
    
    # For neural network: input features
    # x = torch.randn(32, 784)  # (batch_size, input_features)
    # output = model(x)
    # print(f"Output shape: {output.shape}")
`;

  return imports + modelClass + forwardMethod + helperClasses + usageExample;
};
