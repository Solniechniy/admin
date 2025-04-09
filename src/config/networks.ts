import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";

import { arbitrum, base, bsc, Chain, linea, near } from "wagmi/chains";

export enum Network {
  BASE = "base",
  BSC = "bsc",
  BSC_TESTNET = "bsc-testnet",
  LINEA = "linea",
  ARBITRUM = "arbitrum",
  NEAR = "near",
  TON = "ton",
}

export interface NetworkConfig {
  id: string;
  name: string;
  chain: Chain;
  chainId: string;
  rpcUrl: string;
  blockExplorerUrl?: string;
  moduleContract: string | null;
  portalContract: string | null;
  attestationContract?: string | null;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const config = createConfig(
  getDefaultConfig({
    chains: [base, bsc, linea, arbitrum],
    walletConnectProjectId: "27139bc332476e5706ee928fa5b8ee10",
    appName: "Attestation Admin",
    transports: {
      [base.id]: http(),
      [bsc.id]: http(),
      [linea.id]: http(),
      [arbitrum.id]: http(),
    },
  })
);

export const networks: NetworkConfig[] = [
  // {
  //   id: Network.BSC_TESTNET,
  //   chain: bsc,
  //   name: "BSC Testnet",
  //   chainId: "0x61",
  //   rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  //   blockExplorerUrl: "https://testnet.bscscan.com",
  //   moduleContract: "0x3dba2047c87e9fa4e14d97fa11de7f86c959844b",
  //   portalContract: "0x838d82f110f5bdc23732c7acab5949d067594c39",
  //   nativeCurrency: bscTestnet.nativeCurrency,
  // },
  {
    id: Network.BASE,
    chain: base,
    name: "Base Mainnet",
    chainId: "0x2105",
    rpcUrl: "https://mainnet.base.org",
    blockExplorerUrl: "https://basescan.org",
    moduleContract: "0x3eAE5566344e99A9D9c515332883Fd30b5184701",
    portalContract: "0x8d3bc9Ff4e55d09EE547A076D73b50faa4C79C1e",
    nativeCurrency: base.nativeCurrency,
  },
  {
    id: Network.BSC,
    chain: bsc,
    name: "BSC Mainnet",
    chainId: "0x38",
    rpcUrl: "https://bsc-rpc.com",
    blockExplorerUrl: "https://bscscan.com",
    moduleContract: "0x0fEbD23cbefeDF1A65d9FE51a0b6d63C3a477e05",
    portalContract: "0x0b4d4fbde2caf7df2bdb1bfe3fe941ab79f2275f",
    nativeCurrency: bsc.nativeCurrency,
  },
  {
    id: Network.LINEA,
    chain: linea,
    name: "Linea Mainnet",
    chainId: "0x7a69",
    rpcUrl: "https://linea-rpc.com",
    blockExplorerUrl: "https://lineascan.io",
    moduleContract: "0x5AcF01D27F85DA54d34E18A25731f87528f97506",
    portalContract: "0x3853D7CEE9a825A24F48f7e1f6aaEcB91Ba3683f",
    nativeCurrency: linea.nativeCurrency,
  },
  {
    id: Network.ARBITRUM,
    chain: arbitrum,
    name: "Arbitrum Mainnet",
    chainId: "0xa4b1",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io",
    moduleContract: "0xa87B3E7e3bBe0E721309119B610B32683b61db08",
    portalContract: "0x96b3B714A4339b12725f1AFefd6BD844F7b40A30",
    nativeCurrency: arbitrum.nativeCurrency,
  },
  {
    id: Network.NEAR,
    chain: near,
    name: "Near Mainnet",
    chainId: "0x1",
    rpcUrl: "https://rpc.mainnet.near.org",
    blockExplorerUrl: "https://nearblocks.io",
    moduleContract: null,
    portalContract: null,
    attestationContract: "score-v1.hapiprotocol.near",
    nativeCurrency: {
      decimals: 24,
      name: "NEAR",
      symbol: "NEAR",
    },
  },
];
