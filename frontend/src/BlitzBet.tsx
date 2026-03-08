import { useState, useEffect, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
// import { EphemeralRollupClient } from "@magicblock-labs/ephemeral-rollups-sdk";
// import { IDL, PREDICTION_COMPONENT_ID, RESOLVE_SYSTEM_ID } from "./programs/prediction";

export function BlitzBet() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [stage, setStage] = useState<
    | "setup"
    | "initializing"
    | "delegating"
    | "live"
    | "resolving"
    | "claiming"
    | "completed"
  >("setup");

  // Market State
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const currentPriceRef = useRef<number | null>(null);

  const [priceColor, setPriceColor] = useState<
    "#ffffff" | "#00d146" | "#ff3b30"
  >("#ffffff");
  const [strikePrice, setStrikePrice] = useState<number | null>(null);
  const [wager, setWager] = useState<number>(0.1);
  const [direction, setDirection] = useState<"UP" | "DOWN" | null>(null);
  const [result, setResult] = useState<"WON" | "LOST" | null>(null);
  const [countdown, setCountdown] = useState<number>(60);

  // Keep a ref of currentPrice always updated for the pipeline to read without stale closures
  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  // Fetch live SOL price from Helius Digital Asset Standard (DAS) API
  useEffect(() => {
    let isMounted = true;

    const fetchHeliusPrice = async () => {
      const apiKey = import.meta.env.VITE_HELIUS_API_KEY;
      if (!apiKey || apiKey === "your_helius_api_key_here") {
        if (isMounted) setCurrentPrice(null);
        return;
      }

      try {
        const rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "sol-price-query",
            method: "getAsset",
            params: {
              id: "So11111111111111111111111111111111111111112",
              displayOptions: { showFungible: true },
            },
          }),
        });

        const data = await response.json();
        const priceInfo = data?.result?.token_info?.price_info;

        if (priceInfo && priceInfo.price_per_token && isMounted) {
          const newPrice = Number(priceInfo.price_per_token);

          setCurrentPrice((prevPrice) => {
            if (prevPrice !== null && newPrice !== prevPrice) {
              if (newPrice > prevPrice) setPriceColor("#00d146");
              else if (newPrice < prevPrice) setPriceColor("#ff3b30");

              setTimeout(() => {
                if (isMounted) setPriceColor("#ffffff");
              }, 400);
            }
            return newPrice;
          });
        }
      } catch (err) {
        console.error("Helius API Error:", err);
      }
    };

    fetchHeliusPrice();
    const interval = setInterval(fetchHeliusPrice, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // The Automated Pipeline
  const executePipeline = async () => {
    if (
      !currentPriceRef.current ||
      stage !== "setup" ||
      !direction ||
      !wallet.publicKey
    )
      return;

    // Lock in the bet
    const lockedStrike = currentPriceRef.current;
    setStrikePrice(lockedStrike);
    setResult(null);

    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "confirmed",
    });

    // In a real implementation, we would instantiate the EphemeralRollupClient here
    // const erClient = new EphemeralRollupClient(provider);

    try {
      // 1. Initialize (L1)
      setStage("initializing");

      // Mock initialization on L1
      // const program = new Program(IDL, PREDICTION_COMPONENT_ID, provider);
      // await program.methods.initialize(...)

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Delegate (L1 -> ER)
      setStage("delegating");

      // Mock delegation to Ephemeral Rollup
      // await erClient.delegate(...)

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Live 60-Second ER Session
      setStage("live");
      for (let i = 60; i >= 0; i--) {
        setCountdown(i);
        if (i > 0) await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 4. Resolve on ER (Fast-path)
      setStage("resolving");

      const finalPrice = currentPriceRef.current;
      const isUp = finalPrice > lockedStrike;

      // Mock resolution on ER
      // const args_p = new BN(finalPrice).toArrayLike(Buffer, 'le', 8);
      // await erClient.execute(RESOLVE_SYSTEM_ID, args_p, ...);
      // await new Promise((resolve) => setTimeout(resolve, 10)); // ER sub-10ms

      // Simulate logic check
      if ((direction === "UP" && isUp) || (direction === "DOWN" && !isUp)) {
        setResult("WON");
      } else {
        setResult("LOST");
      }

      // 5. Commit/Claim (ER -> L1)
      setStage("claiming");

      // Mock commit back to L1
      // await erClient.undelegate(...)

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStage("completed");

      // Auto-reset after a few seconds
      setTimeout(() => {
        setStage("setup");
        setDirection(null);
        setStrikePrice(null);
        setResult(null);
        setCountdown(60);
      }, 5000);
    } catch (e) {
      console.error(e);
      setStage("setup"); // Reset on error
    }
  };

  const getPipelineItemStyle = (itemStage: string, activeStages: string[]) => {
    const isActive = activeStages.includes(stage);
    const isPast =
      stage === "completed" ||
      activeStages.indexOf(stage) > activeStages.indexOf(itemStage) ||
      (itemStage === "initializing" &&
        stage !== "setup" &&
        stage !== "initializing");

    let color = "#444444";
    if (isActive) color = "#aaaaaa";
    if (isPast) color = "#00d146";

    return {
      padding: "8px 12px",
      fontSize: "0.85rem",
      fontWeight: isActive ? 500 : 400,
      color,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease",
    };
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        background: "#000000",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "2rem",
            margin: 0,
            fontWeight: "600",
            letterSpacing: "-0.5px",
          }}
        >
          BlitzBet
        </h1>
        <p
          style={{ color: "#888888", margin: "4px 0 0 0", fontSize: "0.9rem" }}
        >
          Realtime Solana Prediction Market
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            color: "#666666",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          Live SOL/USD
        </div>
        <div
          style={{
            fontSize: currentPrice ? "3.5rem" : "2rem",
            fontWeight: "400",
            color: priceColor,
            transition: "color 0.15s ease-out",
            lineHeight: "1",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {currentPrice
            ? `$${currentPrice.toFixed(2)}`
            : !import.meta.env.VITE_HELIUS_API_KEY ||
              import.meta.env.VITE_HELIUS_API_KEY === "your_helius_api_key_here"
            ? "API Key Required"
            : "Fetching..."}
        </div>

        <div style={{ minHeight: "24px", marginTop: "12px" }}>
          {strikePrice && stage !== "setup" && (
            <div style={{ color: "#aaaaaa", fontSize: "1rem" }}>
              Strike Price:{" "}
              <span style={{ color: "#ffffff", fontWeight: "500" }}>
                ${strikePrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "32px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 100%",
            background: "#1c1c1e",
            borderRadius: "16px",
            padding: "16px 20px",
            boxSizing: "border-box",
          }}
        >
          <label
            style={{
              display: "block",
              color: "#888888",
              fontSize: "0.8rem",
              marginBottom: "6px",
            }}
          >
            Wager Amount
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: "1.25rem",
                marginRight: "4px",
              }}
            >
              ◎
            </span>
            <input
              type="number"
              value={wager}
              onChange={(e) => setWager(Number(e.target.value))}
              disabled={stage !== "setup"}
              style={{
                width: "100%",
                background: "transparent",
                color: "#ffffff",
                fontSize: "1.25rem",
                fontWeight: "500",
                border: "none",
                outline: "none",
                padding: 0,
              }}
            />
          </div>
        </div>
      </div>

      {stage === "setup" ? (
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              color: "#888888",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Predict Direction
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setDirection("UP")}
              style={{
                flex: "1 1 calc(50% - 12px)",
                minWidth: "120px",
                padding: "16px",
                fontSize: "1.1rem",
                fontWeight: "600",
                backgroundColor: direction === "UP" ? "#00d146" : "#1c1c1e",
                color: direction === "UP" ? "#ffffff" : "#00d146",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Up
            </button>
            <button
              onClick={() => setDirection("DOWN")}
              style={{
                flex: "1 1 calc(50% - 12px)",
                minWidth: "120px",
                padding: "16px",
                fontSize: "1.1rem",
                fontWeight: "600",
                backgroundColor: direction === "DOWN" ? "#ff3b30" : "#1c1c1e",
                color: direction === "DOWN" ? "#ffffff" : "#ff3b30",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Down
            </button>
          </div>

          <button
            onClick={executePipeline}
            disabled={!direction || !currentPrice}
            style={{
              width: "100%",
              padding: "18px",
              fontSize: "1.2rem",
              fontWeight: "600",
              backgroundColor:
                direction && currentPrice ? "#007aff" : "#1c1c1e",
              color: direction && currentPrice ? "#ffffff" : "#666666",
              border: "none",
              borderRadius: "16px",
              cursor: direction && currentPrice ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            Lock In
          </button>
        </div>
      ) : (
        <div
          style={{
            marginBottom: "40px",
            textAlign: "center",
            padding: "30px 20px",
            background: "#1c1c1e",
            borderRadius: "16px",
          }}
        >
          {stage === "completed" ? (
            <div>
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "#888",
                  marginBottom: "8px",
                }}
              >
                Result
              </div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: result === "WON" ? "#00d146" : "#ff3b30",
                }}
              >
                {result === "WON" ? "🎉 YOU WON!" : "💀 YOU LOST"}
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#888",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Time Remaining
              </div>
              <div
                style={{
                  fontSize: "4rem",
                  fontWeight: "400",
                  color: "#ffffff",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                {countdown}s
              </div>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          opacity: stage === "setup" ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            color: "#666666",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Execution Pipeline
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={getPipelineItemStyle("initializing", ["initializing"])}>
            <span>1. Escrow Locked (Devnet L1)</span>
            {stage !== "setup" && stage !== "initializing" && <span>✓</span>}
          </div>

          <div style={getPipelineItemStyle("delegating", ["delegating"])}>
            <span>2. Delegate to Ephemeral Rollup</span>
            {["live", "resolving", "claiming", "completed"].includes(stage) && (
              <span>✓</span>
            )}
          </div>

          <div style={getPipelineItemStyle("live", ["live"])}>
            <span>3. Market Live (60s duration)</span>
            {["resolving", "claiming", "completed"].includes(stage) && (
              <span>✓</span>
            )}
          </div>

          <div style={getPipelineItemStyle("resolving", ["resolving"])}>
            <span>4. Sub-10ms ER Resolution</span>
            {["claiming", "completed"].includes(stage) && (
              <span
                style={{
                  color: result === "WON" ? "#00d146" : "#ff3b30",
                  fontWeight: "bold",
                }}
              >
                {result}
              </span>
            )}
          </div>

          <div style={getPipelineItemStyle("claiming", ["claiming"])}>
            <span>5. Commit & Claim (Devnet L1)</span>
            {stage === "completed" && <span>✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
