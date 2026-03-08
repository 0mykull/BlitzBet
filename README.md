# BlitzBet - Realtime Solana Prediction Market

BlitzBet is a lightning-fast, gamified Solana prediction market built on the **MagicBlock Ephemeral Rollups** infrastructure and the **BOLT ECS** framework.

This application demonstrates the power of sub-10ms ephemeral state transitions, allowing users to make 60-second predictions on the live SOL/USD price without suffering from standard L1 network congestion or high latency.

## 🚀 Features

- **Realtime Oracle**: Fetches ultra-fast tick data via the **Helius Digital Asset Standard (DAS) API**.
- **Ephemeral Rollup Execution**: Utilizes MagicBlock's sub-10ms Fast-Path to completely bypass Solana base-layer latency when executing core game/trading logic.
- **Automated ECS Pipeline**: Visually tracks the real-time progression of your wager across the 4 MagicBlock deployment stages:
  1. _Initialize (L1)_: Lock wager into Escrow on Devnet.
  2. _Delegate (L1 → ER)_: Transfer prediction state ownership to the MagicBlock Ephemeral Rollup.
  3. _Execute Fast-Path (ER)_: Resolve the 60s prediction instantly inside the high-frequency rollup environment.
  4. _Commit (ER → L1)_: Settle the final game state back to the Solana base layer.
- **Sleek UI**: Modern, responsive, mobile-friendly interface designed like a high-end trading terminal.

## Quick Start

### 1. Install Dependencies

Run this command in the `frontend` directory:

```bash
cd frontend
bun install
```

### 2. Configure Environment Variables

BlitzBet uses the Helius API to bypass CORS blocks on standard crypto endpoints.
Create a `.env` file in the `frontend` folder:

```bash
touch frontend/.env
```

Inside `.env`, insert your Helius API key:

```env
VITE_HELIUS_API_KEY=your_helius_api_key_here
```

### 3. Run the Development Server

```bash
bun dev
```

Navigate to `http://localhost:5173` to test the application.

## 🏗 Architecture

### Entity Component System (ECS)

The smart contract logic (intended for the `/programs-ecs` directory using BOLT CLI) follows strict ECS rules:

- **State (Component)**: A `Prediction` component struct tracking `wager`, `strike_price`, `direction`, and `resolved_status`.
- **Logic (System)**: A `ResolveSystem` that is explicitly decorated with the `#[ephemeral]` Rust macro, signaling that this system runs exclusively on the MagicBlock Ephemeral Rollup.

### The Pipeline Logic

To read about exactly how the L1 / Ephemeral Rollup context boundaries are handled, please refer to the `PREDICTION_MARKET_ARCHITECTURE.md` file included in the root of this project.
