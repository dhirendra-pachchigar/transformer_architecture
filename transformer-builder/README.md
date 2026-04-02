# 🧠 Transformer & Neural Network Builder

A professional, interactive drag-and-drop web platform for learning and building Transformer and Neural Network architectures visually.

## 🚀 Live Demo

**Access the application at:** http://localhost:5173/

## ✨ Key Features Implemented

### 1. **Drag-and-Drop Canvas**
- ✅ Drag components from the left sidebar onto the canvas
- ✅ Move nodes freely by dragging them
- ✅ Connect nodes by dragging from output handles to input handles
- ✅ Delete connections by selecting an edge and pressing Delete/Backspace
- ✅ Delete nodes by selecting and pressing Delete/Backspace or using the "Delete Selected" button

### 2. **Transformer Components (20+ Blocks)**

#### Input Pipeline
- Token Input
- Tokenizer
- Input Embedding
- Positional Encoding

#### Attention Internals (Granular)
- Query (Q) Linear Projection
- Key (K) Linear Projection
- Value (V) Linear Projection
- Scaled Dot-Product Attention
- Attention Score (QKᵀ / √d)
- Softmax
- Weighted Sum
- Multi-Head Concatenation
- Final Linear Projection

#### Encoder/Decoder Blocks
- Multi-Head Attention
- Masked Multi-Head Attention
- Encoder-Decoder Attention
- Add & Norm
- Feed Forward Network
- Encoder Block
- Decoder Block

#### Output
- Linear Layer
- Output Tokens

### 3. **Neural Network Components**
- Input Layer
- Dense Layer (with configurable neurons)
- Output Layer
- Activations: ReLU, Sigmoid, Tanh, Softmax, LeakyReLU

### 4. **Real-Time PyTorch Code Generation**
- Generates production-ready PyTorch code based on connected components
- Only shows code for connected components in the graph
- Includes:
  - Model class definition
  - Layer initialization
  - Forward pass implementation
  - Helper classes (PositionalEncoding, etc.)
  - Usage examples

### 5. **Pre-built Templates**
- **BERT Encoder**: Complete encoder architecture
- **GPT Decoder**: Decoder-only architecture with causal masking
- **MLP**: Simple multi-layer perceptron

### 6. **Node Configuration Panel**
- Click any node to configure:
  - Batch size
  - Sequence length
  - d_model (embedding dimension)
  - Number of attention heads
  - Neurons count
  - Activation functions
  - Dropout rate

### 7. **Visual Features**
- Tensor shapes displayed on each node (e.g., `(batch, seq_len, d_model)`)
- Mathematical formulas for each operation
- Color-coded nodes by component type
- Smooth animated connections
- Grid snapping for clean layouts
- Zoom and pan controls

### 8. **Mode Selection**
- **Transformer Mode**: Shows transformer-specific components
- **Neural Mode**: Shows neural network components
- **Hybrid Mode**: Mix both architectures

## 🛠️ Technical Implementation

### Fixed Issues
1. ✅ **Node Movement**: Nodes can now be freely dragged and positioned
2. ✅ **Connection Deletion**: Edges can be deleted via keyboard (Delete/Backspace) or programmatically
3. ✅ **Node Deletion**: Added "Delete Selected" button and keyboard support
4. ✅ **Code Generation**: Now only generates code for connected components
5. ✅ **Type Safety**: Fixed all TypeScript errors with proper function types

### Architecture
- **Frontend**: React + TypeScript
- **State Management**: Zustand
- **Canvas**: React Flow (drag-drop graph library)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

### Project Structure
```
transformer-builder/
├── src/
│   ├── components/
│   │   ├── CustomNode.tsx      # Node visualization with shapes & formulas
│   │   ├── Sidebar.tsx         # Draggable component library
│   │   ├── CodePanel.tsx       # Monaco Editor for PyTorch code
│   │   └── NodeConfigPanel.tsx # Hyperparameter configuration
│   ├── store/
│   │   └── useStore.ts         # Zustand state with templates
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   ├── utils/
│   │   └── codeGenerator.ts    # PyTorch code generation logic
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── dist/                       # Production build
```

## 🎯 How to Use

### Building a Transformer
1. Select "Transformer" mode from the top toolbar
2. Drag components from the left sidebar:
   - Start with "Token Input"
   - Add "Input Embedding"
   - Add "Positional Encoding"
   - Add "Multi-Head Attention" or granular attention blocks
   - Add "Add & Norm" and "Feed Forward"
   - End with "Linear Layer" and "Output Tokens"
3. Connect nodes by dragging from output (right) to input (left)
4. Click nodes to configure parameters
5. Click "Show Code" to see generated PyTorch code

### Building a Neural Network
1. Select "Neural" mode
2. Drag "Input Layer", "Dense Layer(s)", and "Output Layer"
3. Connect them sequentially
4. Configure neurons and activations
5. View generated code

### Loading Templates
- Click "BERT Template", "GPT Template", or "MLP Template" buttons
- Pre-built architecture loads instantly
- Modify as needed

### Deleting Components
- **Delete Node**: Click node → Press Delete/Backspace OR click "Delete Selected" button
- **Delete Connection**: Click edge → Press Delete/Backspace

## 🔥 Advanced Features

### Connected Component Code Generation
The code generator intelligently:
- Identifies connected subgraphs
- Only generates code for connected components
- Ignores orphaned nodes
- Maintains proper layer ordering based on connections

### Type-Safe State Management
- Proper handling of functional updates in Zustand
- Support for both direct values and updater functions
- Full TypeScript type safety

## 📊 Portfolio Highlights

This project demonstrates:
1. **Complex State Management**: Handling graph-based data structures
2. **Real-time Code Generation**: AST-like transformation from visual to code
3. **Educational UX**: Making complex concepts intuitive
4. **Type Safety**: Full TypeScript implementation
5. **Modern React**: Hooks, context, custom hooks
6. **Performance**: Optimized re-renders with Zustand selectors

## 🌐 Access

**Development Server**: http://localhost:5173/

The application is fully functional and ready for demonstration!

## 📝 Next Steps (Optional Enhancements)

- [ ] Add attention weight visualization heatmaps
- [ ] Implement forward pass simulation with real tensors
- [ ] Add model export to ONNX format
- [ ] Include step-by-step animation of data flow
- [ ] Add collaboration features (multi-user editing)
- [ ] Integrate with Hugging Face models

---

**Built with ❤️ for AI Education**
