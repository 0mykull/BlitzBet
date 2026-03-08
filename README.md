# BlitzBet

Real-time Solana prediction market powered by MagicBlock Ephemeral Rollups (proof of concept).

## Architecture

The system utilizes a dual-layer approach to achieve high-frequency interactions:

1.  **Base Layer (Solana)**
    Handles asset custody, escrow creation, and final settlement. This ensures funds are always secure on the main chain.

2.  **Ephemeral Layer (MagicBlock)**
    Executes the core game loop and resolution logic. By delegating state to an Ephemeral Rollup (ER), the application achieves sub-10ms latency for real-time price tracking and resolution.

## Tech Stack

- **Frontend:** React, Vite, Anchor, Solana Wallet Adapter
- **Smart Contracts:** Rust, Bolt (ECS Framework)
- **Infrastructure:** MagicBlock Ephemeral Rollups, Helius APIs

## Project Structure

- `programs/`: Standard Anchor programs for L1 settlement.
- `programs-ecs/`: Bolt ECS components and ephemeral systems.
- `frontend/`: Client-side application and rollup interaction logic.

## Getting Started

### One-Step Setup

Use the included script to check prerequisites, build the backend, install dependencies, and start the frontend.

```bash
./setup.sh
```

### Manual Setup

#### Prerequisites

- Rust and Cargo
- Solana Tool Suite
- Bolt CLI
- Node.js and Bun/Yarn

#### Backend Setup

Build the specific ephemeral components and systems.

```bash
bolt build
```

To run a local simulation environment:

```bash
bolt test
```

### Frontend Setup

Navigate to the interface directory and install dependencies.

```bash
cd frontend
bun install
```

Configure your environment variables in a `.env` file to include your RPC endpoints (Helius/Solana).

Start the development server:

```bash
bun dev
```
