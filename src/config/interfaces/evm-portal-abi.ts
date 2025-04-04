export const evmPortalABI = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "modules",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "router",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyPortalOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawFail",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongWithdrawAddress",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawed",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload",
        name: "attestationPayload",
        type: "tuple",
      },
      {
        internalType: "bytes[]",
        name: "validationPayloads",
        type: "bytes[]",
      },
    ],
    name: "attest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload",
        name: "attestationPayload",
        type: "tuple",
      },
      {
        internalType: "bytes[]",
        name: "validationPayloads",
        type: "bytes[]",
      },
    ],
    name: "attestV2",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "attestationRegistry",
    outputs: [
      {
        internalType: "contract AttestationRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload[]",
        name: "attestationsPayloads",
        type: "tuple[]",
      },
      {
        internalType: "bytes[][]",
        name: "validationPayloads",
        type: "bytes[][]",
      },
    ],
    name: "bulkAttest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload[]",
        name: "attestationPayloads",
        type: "tuple[]",
      },
      {
        internalType: "bytes[][]",
        name: "validationPayloads",
        type: "bytes[][]",
      },
    ],
    name: "bulkAttestV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "attestationIds",
        type: "bytes32[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload[]",
        name: "attestationsPayloads",
        type: "tuple[]",
      },
      {
        internalType: "bytes[][]",
        name: "validationPayloads",
        type: "bytes[][]",
      },
    ],
    name: "bulkReplace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "attestationIds",
        type: "bytes32[]",
      },
    ],
    name: "bulkRevoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAttester",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getModules",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "moduleRegistry",
    outputs: [
      {
        internalType: "contract ModuleRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "modules",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "portalRegistry",
    outputs: [
      {
        internalType: "contract PortalRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload",
        name: "attestationPayload",
        type: "tuple",
      },
      {
        internalType: "bytes[]",
        name: "validationPayloads",
        type: "bytes[]",
      },
    ],
    name: "replace",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "contract IRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default evmPortalABI;
