import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";

/**
 * A mock Wallet implementation for Anchor in the browser using a local Keypair.
 * Real apps should use @solana/wallet-adapter-react instead.
 */
class LocalWallet {
  payer: Keypair;

  constructor(payer: Keypair) {
    this.payer = payer;
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T
  ): Promise<T> {
    if (tx instanceof VersionedTransaction) {
      tx.sign([this.payer]);
    } else {
      tx.partialSign(this.payer);
    }
    return tx;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[]
  ): Promise<T[]> {
    return txs.map((t) => {
      if (t instanceof VersionedTransaction) {
        t.sign([this.payer]);
      } else {
        t.partialSign(this.payer);
      }
      return t;
    });
  }

  get publicKey() {
    return this.payer.publicKey;
  }
}

/**
 * Dual-Path Setup for MagicBlock Ephemeral Rollups
 *
 * 1. Devnet Provider: Used for Initialization, Delegation, and Undelegation (L1).
 * 2. Ephemeral Provider: Used for executing Fast-Path game logic via `#[ephemeral]` systems.
 */

export function createProviders(walletKeypair: Keypair): {
  devnetProvider: AnchorProvider;
  ephemeralProvider: AnchorProvider;
} {
  const wallet = new LocalWallet(walletKeypair);

  // --- L1 (Solana Devnet) Setup ---
  const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
  const devnetUrl = heliusApiKey
    ? `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    : "https://api.devnet.solana.com";

  const devnetConnection = new Connection(devnetUrl, "confirmed");

  const devnetProvider = new AnchorProvider(devnetConnection, wallet, {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
  });

  // --- Fast-Path (Ephemeral Rollup) Setup ---
  // Note: Ephemeral Rollups process transactions in <10ms.
  const ephemeralUrl =
    import.meta.env.VITE_EPHEMERAL_RPC_URL || "https://devnet.magicblock.app/";
  const ephemeralConnection = new Connection(ephemeralUrl, "confirmed");

  const ephemeralProvider = new AnchorProvider(ephemeralConnection, wallet, {
    preflightCommitment: "processed",
    commitment: "processed",
  });

  return { devnetProvider, ephemeralProvider };
}
