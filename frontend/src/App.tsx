import { useMemo, useState, useEffect } from "react";
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
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (connected) {
      setShowPopup(true);
      // Auto-hide popup after 5 seconds
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [connected]);

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

  return (
    <>
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 209, 70, 0.9)",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: "500",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          Proof of Concept: No actual funds will be deducted during
          transactions!
        </div>
      )}
      {children}
    </>
  );
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
              justifyContent: "center",
              padding: "2rem 1rem",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <WalletConnectionWrapper>
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  zIndex: 50,
                }}
              >
                <WalletMultiButton
                  style={{
                    backgroundColor: "#1c1c1e",
                    border: "1px solid #333",
                    fontSize: "0.85rem",
                    height: "40px",
                    borderRadius: "12px",
                  }}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <BlitzBet />
              </div>
            </WalletConnectionWrapper>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
