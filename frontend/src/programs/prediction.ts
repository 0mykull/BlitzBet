import { PublicKey } from "@solana/web3.js";

export const PREDICTION_COMPONENT_ID = new PublicKey(
  "B3fMRhqjewwf938pybLncA4o1wErSvzMhQfGg7EkDani"
);
export const RESOLVE_SYSTEM_ID = new PublicKey(
  "DHB1zodaXgDG4n7W1KqjooVhQ3bc5vm3ZMEDkaSjMk9d"
);
export const BLITZBET_PROGRAM_ID = new PublicKey(
  "9PsgRUyaxqZBbCKXELZuu3sPVzzuw8S7xxFUNkycoDfB"
);

export const BLITZBET_IDL: any = {
  version: "0.1.0",
  name: "blitzbet",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "prediction", isMut: true, isSigner: true },
        { name: "signer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: "InitializeArgs",
          },
        },
      ],
    },
  ],
  accounts: [],
  types: [
    {
      name: "InitializeArgs",
      type: {
        kind: "struct",
        fields: [
          { name: "wager", type: "u64" },
          { name: "strikePrice", type: "u64" },
          { name: "direction", type: "u8" },
        ],
      },
    },
  ],
};

export const IDL: any = {
  version: "0.1.0",
  name: "prediction",
  instructions: [
    {
      name: "resolve",
      accounts: [
        {
          name: "prediction",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "args_p",
          type: "bytes",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Prediction",
      type: {
        kind: "struct",
        fields: [
          { name: "wager", type: "u64" },
          { name: "strikePrice", type: "u64" },
          { name: "direction", type: "u8" },
          { name: "resolvedStatus", type: "u8" },
        ],
      },
    },
  ],
  types: [],
};
