export type NodeType = 
  // Transformer Input Pipeline
  | 'TokenInput'
  | 'Tokenizer'
  | 'InputEmbedding'
  | 'PositionalEncoding'
  // Attention Internal Blocks
  | 'QueryProjection'
  | 'KeyProjection'
  | 'ValueProjection'
  | 'ScaledDotProduct'
  | 'AttentionScore'
  | 'Softmax'
  | 'WeightedSum'
  | 'MultiHeadConcat'
  | 'FinalLinearProjection'
  // Encoder Blocks
  | 'MultiHeadAttention'
  | 'AddNorm'
  | 'FeedForward'
  | 'EncoderBlock'
  // Decoder Blocks
  | 'MaskedMultiHeadAttention'
  | 'EncoderDecoderAttention'
  | 'DecoderBlock'
  // Output Blocks
  | 'LinearLayer'
  | 'OutputTokens'
  // Neural Network Blocks
  | 'NNInput'
  | 'DenseLayer'
  | 'NNOutput';

export type ActivationType = 'ReLU' | 'Sigmoid' | 'Tanh' | 'Softmax' | 'LeakyReLU' | 'None';

export interface NodeData {
  nodeType: NodeType;
  label: string;
  description?: string;
  config: {
    neurons?: number;
    activation?: ActivationType;
    d_model?: number;
    num_heads?: number;
    seq_len?: number;
    batch_size?: number;
    dropout?: number;
    weights?: number[][];
    bias?: number[];
  };
  tensorShape?: string;
  mathFormula?: string;
  isValid?: boolean;
  errorMessage?: string;
}

export interface TensorShape {
  batch_size: number;
  seq_len?: number;
  features: number;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
