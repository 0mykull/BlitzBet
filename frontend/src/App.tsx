import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
// Import default wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";

import { BlitzBet } from "./BlitzBet";
import "./App.css";

function WalletConnectionWrapper({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#1c1c1e",
            padding: "40px",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <h2
            style={{ fontSize: "2rem", margin: "0 0 10px 0", color: "#ffffff" }}
          >
            BlitzBet
          </h2>
          <p
            style={{
              color: "#888888",
              marginBottom: "30px",
              lineHeight: "1.5",
            }}
          >
            Connect your wallet to enter the Ephemeral Rollup arena. No actual
            funds will be taken in this PoC.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WalletMultiButton style={{ backgroundColor: "#00d146" }} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  // Use Helius API if available, otherwise fallback to Devnet
  const endpoint = useMemo(() => {
    const heliusApiKey = import.meta.env.VITE_HELIUS_API_KEY;
    if (heliusApiKey && heliusApiKey !== "your_helius_api_key_here") {
      return `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`;
    }
    return "https://api.devnet.solana.com";
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Backpack is auto-detected by standard wallet adapter
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#000000",
              color: "#ffffff",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              alignItems: "center",
              padding: "2rem 1rem",
            }}
          >
            <WalletConnectionWrapper>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  maxWidth: "600px",
                  marginBottom: "20px",
                }}
              >
                <WalletMultiButton
                  style={{
                    backgroundColor: "#1c1c1e",
                    border: "1px solid #333",
                    fontSize: "0.85rem",
                    height: "40px",
                  }}
                />
              </div>
              <BlitzBet />
            </WalletConnectionWrapper>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
