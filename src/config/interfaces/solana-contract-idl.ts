export type HapiSolanaAttestation = {
  version: "0.1.0";
  name: "hapi_solana_attestation";
  instructions: [
    {
      name: "initializeContractState";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "verifyingAddress";
          type: {
            array: ["u8", 64];
          };
        },
        {
          name: "authority";
          type: "publicKey";
        },
        {
          name: "feeMint";
          type: "publicKey";
        },
        {
          name: "createAttestationFee";
          type: "u64";
        },
        {
          name: "updateAttestationFee";
          type: "u64";
        },
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "setVerifyingAddress";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "verifyingAddress";
          type: {
            array: ["u8", 64];
          };
        }
      ];
    },
    {
      name: "setAuthority";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "authority";
          type: "publicKey";
        }
      ];
    },
    {
      name: "setFeeMint";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "feeMint";
          type: "publicKey";
        }
      ];
    },
    {
      name: "setUpdateAttestationFee";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "feeAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "setCreateAttestationFee";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "feeAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "attestUser";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "state";
          isMut: false;
          isSigner: false;
        },
        {
          name: "senderTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "signature";
          type: {
            array: ["u8", 64];
          };
        },
        {
          name: "recoveryId";
          type: "u8";
        },
        {
          name: "score";
          type: "u8";
        },
        {
          name: "expirationDate";
          type: "i64";
        },
        {
          name: "bump";
          type: "u8";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "state";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Account version"];
            type: "u16";
          },
          {
            name: "bump";
            docs: ["Seed bump for PDA"];
            type: "u8";
          },
          {
            name: "authority";
            docs: ["Contract authority"];
            type: "publicKey";
          },
          {
            name: "verifyingAddress";
            docs: ["Public key that will be used for verifying the signature"];
            type: {
              array: ["u8", 64];
            };
          },
          {
            name: "feeMint";
            docs: ["Attestation fee mint"];
            type: "publicKey";
          },
          {
            name: "createAttestationFee";
            docs: ["Create attestation fee amount"];
            type: "u64";
          },
          {
            name: "updateAttestationFee";
            docs: ["Update attestation fee amount"];
            type: "u64";
          },
          {
            name: "updatedAt";
            docs: ["Timestamp when the state was last updated"];
            type: "i64";
          }
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Account version"];
            type: "u16";
          },
          {
            name: "bump";
            docs: ["Seed bump for PDA"];
            type: "u8";
          },
          {
            name: "address";
            docs: ["User wallet address"];
            type: "publicKey";
          },
          {
            name: "score";
            docs: ["User score"];
            type: "u8";
          },
          {
            name: "expirationDate";
            docs: ["Score expiration day"];
            type: "i64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "AuthorityMismatch";
      msg: "Authority mismatched";
    },
    {
      code: 6001;
      name: "InvalidFee";
      msg: "Invalid fee amount";
    },
    {
      code: 6002;
      name: "IllegalOwner";
      msg: "Account has illegal owner";
    },
    {
      code: 6003;
      name: "InvalidProgramData";
      msg: "Invalid program data account";
    },
    {
      code: 6004;
      name: "InvalidProgramAccount";
      msg: "Invalid program account";
    },
    {
      code: 6005;
      name: "InvalidToken";
      msg: "Invalid token account";
    },
    {
      code: 6006;
      name: "InvalidMsg";
      msg: "Provided message is invalid";
    },
    {
      code: 6007;
      name: "InvalidRecoveryId";
      msg: "Provided recovery id is invalid";
    },
    {
      code: 6008;
      name: "InvalidSignature";
      msg: "Provided signature is invalid";
    },
    {
      code: 6009;
      name: "VerificationFailed";
      msg: "ECDSA verification failed";
    }
  ];
};

export const IDL: HapiSolanaAttestation = {
  version: "0.1.0",
  name: "hapi_solana_attestation",
  instructions: [
    {
      name: "initializeContractState",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programData",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "verifyingAddress",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "authority",
          type: "publicKey",
        },
        {
          name: "feeMint",
          type: "publicKey",
        },
        {
          name: "createAttestationFee",
          type: "u64",
        },
        {
          name: "updateAttestationFee",
          type: "u64",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "setVerifyingAddress",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "verifyingAddress",
          type: {
            array: ["u8", 64],
          },
        },
      ],
    },
    {
      name: "setAuthority",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "authority",
          type: "publicKey",
        },
      ],
    },
    {
      name: "setFeeMint",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "feeMint",
          type: "publicKey",
        },
      ],
    },
    {
      name: "setUpdateAttestationFee",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "feeAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "setCreateAttestationFee",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "feeAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "attestUser",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "state",
          isMut: false,
          isSigner: false,
        },
        {
          name: "senderTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feeTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "signature",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "recoveryId",
          type: "u8",
        },
        {
          name: "score",
          type: "u8",
        },
        {
          name: "expirationDate",
          type: "i64",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "state",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Account version"],
            type: "u16",
          },
          {
            name: "bump",
            docs: ["Seed bump for PDA"],
            type: "u8",
          },
          {
            name: "authority",
            docs: ["Contract authority"],
            type: "publicKey",
          },
          {
            name: "verifyingAddress",
            docs: ["Public key that will be used for verifying the signature"],
            type: {
              array: ["u8", 64],
            },
          },
          {
            name: "feeMint",
            docs: ["Attestation fee mint"],
            type: "publicKey",
          },
          {
            name: "createAttestationFee",
            docs: ["Create attestation fee amount"],
            type: "u64",
          },
          {
            name: "updateAttestationFee",
            docs: ["Update attestation fee amount"],
            type: "u64",
          },
          {
            name: "updatedAt",
            docs: ["Timestamp when the state was last updated"],
            type: "i64",
          },
        ],
      },
    },
    {
      name: "user",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Account version"],
            type: "u16",
          },
          {
            name: "bump",
            docs: ["Seed bump for PDA"],
            type: "u8",
          },
          {
            name: "address",
            docs: ["User wallet address"],
            type: "publicKey",
          },
          {
            name: "score",
            docs: ["User score"],
            type: "u8",
          },
          {
            name: "expirationDate",
            docs: ["Score expiration day"],
            type: "i64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "AuthorityMismatch",
      msg: "Authority mismatched",
    },
    {
      code: 6001,
      name: "InvalidFee",
      msg: "Invalid fee amount",
    },
    {
      code: 6002,
      name: "IllegalOwner",
      msg: "Account has illegal owner",
    },
    {
      code: 6003,
      name: "InvalidProgramData",
      msg: "Invalid program data account",
    },
    {
      code: 6004,
      name: "InvalidProgramAccount",
      msg: "Invalid program account",
    },
    {
      code: 6005,
      name: "InvalidToken",
      msg: "Invalid token account",
    },
    {
      code: 6006,
      name: "InvalidMsg",
      msg: "Provided message is invalid",
    },
    {
      code: 6007,
      name: "InvalidRecoveryId",
      msg: "Provided recovery id is invalid",
    },
    {
      code: 6008,
      name: "InvalidSignature",
      msg: "Provided signature is invalid",
    },
    {
      code: 6009,
      name: "VerificationFailed",
      msg: "ECDSA verification failed",
    },
  ],
};
