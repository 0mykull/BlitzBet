# BlitzBet

**Real-time Solana Prediction Market** powered by **MagicBlock Ephemeral Rollups**.

**Live Demo:** [https://blitzbet-app.vercel.app/](https://blitzbet-app.vercel.app/)

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Solana Powered](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![MagicBlock](https://img.shields.io/badge/MagicBlock-Ephemeral--Rollups-00d146?style=for-the-badge)](https://magicblock.gg)

---

## Overview

BlitzBet is a high-frequency prediction market demonstration. It allows users to wager on the **SOL/USD** price action with sub-10ms resolution speeds.

By leveraging **Ephemeral Rollups (ER)**, BlitzBet removes the latency bottlenecks of traditional L1 settlement during the active game loop, providing a "Web2-like" speed experience on top of Solana's security.

### Core Logic

1.  **Price Feed:** Powered by the **Helius Digital Asset Standard (DAS) API**, providing millisecond-accurate price data for SOL/USD.
2.  **L1 Escrow:** Initial wagers are conceptually locked on Solana Devnet.
3.  **ER Delegation:** The game state is delegated to a MagicBlock Ephemeral Rollup for the 60-second "Live" window.
4.  **Sub-10ms Resolution:** The final price check and winner determination happen instantly on the rollup.
5.  **Settlement:** Results are committed back to the Solana L1 for final payout/claims.

---

## Tech Stack

- **Oracle Data:** [Helius API](https://helius.dev) (High-speed asset price indexing).
- **Rollup Engine:** [MagicBlock Bolt SDK](https://github.com/magicblock-labs/bolt) (Ephemeral Rollups).
- **Framework:** [Anchor](https://www.anchor-lang.com/) & [Bolt ECS](https://bolt.magicblock.gg/).
- **Frontend:** React + Vite + TypeScript.
- **Styling:** Minimalist "Blitz" Dark Mode.

---

## Project Structure

```bash
├── programs/           # Solana L1 Anchor Programs (Escrow & Settlement)
├── programs-ecs/       # Bolt ECS Components & Ephemeral Systems
├── frontend/           # High-performance React Interface
└── setup.sh            # Automated environment setup script
```

---

## Proof of Concept (PoC) Mode

To ensure a seamless testing experience, this version of BlitzBet operates in **Simulation Mode** for L1 transactions:

- **No real SOL required:** L1 Escrow and Delegation steps are simulated to avoid constant wallet pop-ups.
- **Real ER Resolution:** The sub-10ms resolution step still hits the **MagicBlock Devnet RPC** to demonstrate genuine rollup performance.
- **Dynamic Wager:** Toggle between **SOL** and **USD** inputs with live conversion based on current market rates.

---

## Getting Started

### Quick Start (Recommended)

Run the automated setup script to build programs and install dependencies:

```bash
./setup.sh
```

### Vercel Deployment

BlitzBet is optimized for Vercel.

1. Point the **Root Directory** to `frontend/`.
2. Set the `VITE_HELIUS_API_KEY` environment variable.
3. Deploy!

---

## License

MIT
