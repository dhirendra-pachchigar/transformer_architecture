# 🧠 Transformer & Neural Network Builder

A highly interactive, visual, drag-and-drop web platform for learning and building **Transformer Architecture** and **Neural Networks**. This tool behaves like a professional ETL pipeline builder (similar to Airflow or Node-RED), enabling students to visually assemble architectures while understanding the mathematical foundations.

## ✨ Features

### Transformer Architecture Builder
- **Full Granular Components**: Build transformers from individual blocks
  - Input Pipeline: Token Input, Tokenizer, Input Embedding, Positional Encoding
  - Attention Internals: Q/K/V Projections, Scaled Dot-Product, Attention Scores, Softmax, Weighted Sum
  - Encoder Blocks: Multi-Head Attention, Add & Norm, Feed Forward
  - Decoder Blocks: Masked MHA, Encoder-Decoder Attention
  - Output: Linear Layers, Softmax, Output Tokens

### Neural Network Builder
- Input Layer, Dense Layers, Hidden Layers, Output Layer
- Configurable neurons and activation functions (ReLU, Sigmoid, Tanh, Softmax, LeakyReLU)
- Manual weight editing support

### Key Features
- **Drag-and-Drop Interface**: Intuitive node-based editor powered by React Flow
- **Real-time PyTorch Code Generation**: Automatically generates production-ready PyTorch code
- **Tensor Shape Visualization**: See tensor shapes at each node (e.g., `(batch_size, seq_len, d_model)`)
- **Mathematical Formulas**: Each node displays its mathematical operation
- **Pre-built Templates**: BERT Encoder, GPT Decoder, Simple MLP
- **Configuration Panel**: Adjust hyperparameters for each component
- **Mode Selection**: Switch between Transformer, Neural Network, and Hybrid modes

## 🏗️ Project Structure

```
transformer-builder/
├── src/
│   ├── components/
│   │   ├── CustomNode.tsx      # Custom React Flow node component
│   │   ├── Sidebar.tsx         # Draggable component sidebar
│   │   ├── CodePanel.tsx       # Monaco Editor for PyTorch code
│   │   └── NodeConfigPanel.tsx # Node configuration panel
│   ├── store/
│   │   └── useStore.ts         # Zustand state management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── codeGenerator.ts    # PyTorch code generation logic
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd transformer-builder
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Building a Transformer

1. **Drag Components**: Drag transformer blocks from the left sidebar onto the canvas
2. **Connect Nodes**: Connect nodes by dragging from output handles (bottom) to input handles (top)
3. **Configure**: Click on any node to configure its parameters in the right panel
4. **View Code**: Click "Show Code" to see the generated PyTorch implementation

### Example: BERT-like Encoder

1. Start with `Token Input` → `Input Embedding` → `Positional Encoding`
2. Add `Multi-Head Attention` → `Add & Norm`
3. Add `Feed Forward` → `Add & Norm`
4. End with `Linear Layer` → `Output Tokens`

### Example: GPT-like Decoder

1. Start with `Token Input` → `Input Embedding` → `Positional Encoding`
2. Add `Masked MHA` → `Add & Norm`
3. Add `Feed Forward` → `Add & Norm`
4. Repeat steps 2-3 for multiple layers
5. End with `Linear Layer` → `Output Tokens`

### Example: Simple MLP

1. Start with `Input Layer` (configure input features)
2. Add multiple `Dense Layer` nodes with desired neurons and activations
3. End with `Output Layer` (configure output classes)

## 🎨 Component Categories

### Color Coding
- 🔵 **Blue**: Input Pipeline components
- 🟣 **Purple**: Attention mechanism components
- 🟢 **Green**: Encoder block components
- 🟡 **Yellow**: Decoder block components
- 🔴 **Red**: Output components
- 🩷 **Pink**: Neural Network components

## 📝 Generated Code Example

When you build an architecture, the tool generates PyTorch code like:

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class TransformerArchitecture(nn.Module):
    def __init__(self, d_model=512, num_heads=8, vocab_size=30522, max_seq_len=512, dropout=0.1):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        
        self.embedding_0 = nn.Embedding(vocab_size, d_model)
        self.pos_encoder = PositionalEncoding(d_model, dropout, max_seq_len)
        self.attention_1 = nn.MultiheadAttention(d_model, num_heads, dropout=0.1, batch_first=True)
        self.norm_1_1 = nn.LayerNorm(d_model)
        self.ffn_2 = nn.Sequential(
            nn.Linear(d_model, 2048),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(2048, d_model),
        )
        self.norm_2_2 = nn.LayerNorm(d_model)
        
    def forward(self, x):
        batch_size, seq_len = x.shape
        
        x = self.embedding_0(x)
        x = self.pos_encoder(x)
        attn_output, _ = self.attention_1(x, x, x)
        x = self.norm_1_1(x + attn_output)
        ffn_output = self.ffn_2(x)
        x = self.norm_2_2(x + ffn_output)
        
        return x
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Graph Library**: React Flow (drag-and-drop graph editor)
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Styling**: Inline styles with CSS variables

## 🎯 Learning Objectives

This tool helps students understand:

1. **Data Flow**: How tensors transform through each layer
2. **Architecture Design**: Valid transformer and neural network structures
3. **Mathematical Foundations**: Formulas displayed for each operation
4. **Implementation**: Real PyTorch code that can be used in projects
5. **Hyperparameters**: Impact of different configuration choices

## 📄 License

MIT License - Feel free to use this for educational purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
