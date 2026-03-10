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
  address: "9PsgRUyaxqZBbCKXELZuu3sPVzzuw8S7xxFUNkycoDfB",
  metadata: {
    address: "9PsgRUyaxqZBbCKXELZuu3sPVzzuw8S7xxFUNkycoDfB",
  },
  instructions: [
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        { name: "prediction", writable: true, signer: true },
        { name: "signer", writable: true, signer: true },
        { name: "systemProgram" },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: {
              name: "InitializeArgs",
            },
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
  address: "B3fMRhqjewwf938pybLncA4o1wErSvzMhQfGg7EkDani",
  metadata: {
    address: "B3fMRhqjewwf938pybLncA4o1wErSvzMhQfGg7EkDani",
  },
  instructions: [
    {
      name: "resolve",
      discriminator: [246, 150, 236, 206, 108, 63, 58, 10],
      accounts: [
        {
          name: "prediction",
          writable: true,
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
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
  types: [
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
};
