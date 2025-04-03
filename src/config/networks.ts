import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";

import { arbitrum, base, bsc, bscTestnet, Chain, linea } from "wagmi/chains";

export interface NetworkConfig {
  id: string;
  name: string;
  chain: Chain;
  chainId: string;
  rpcUrl: string;
  blockExplorerUrl?: string;
  attestationContract: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const config = createConfig(
  getDefaultConfig({
    chains: [base, bsc, linea, arbitrum, bscTestnet],
    walletConnectProjectId: "27139bc332476e5706ee928fa5b8ee10",
    appName: "Attestation Admin",
    transports: {
      [base.id]: http(),
      [bsc.id]: http(),
      [linea.id]: http(),
      [arbitrum.id]: http(),
      [bscTestnet.id]: http(),
    },
  })
);

export const networks: NetworkConfig[] = [
  {
    id: "bsc-testnet",
    chain: bscTestnet,
    name: "BSC Testnet",
    chainId: "0x61",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockExplorerUrl: "https://testnet.bscscan.com",
    attestationContract: "0x3Dba2047c87E9Fa4e14D97Fa11De7f86C959844b",
    nativeCurrency: bscTestnet.nativeCurrency,
  },
  {
    id: "base-mainnet",
    chain: base,
    name: "Base Mainnet",
    chainId: "0x2105",
    rpcUrl: "https://mainnet.base.org",
    blockExplorerUrl: "https://basescan.org",
    attestationContract: "0x3eAE5566344e99A9D9c515332883Fd30b5184701",
    nativeCurrency: base.nativeCurrency,
  },
  {
    id: "bsc-mainnet",
    chain: bsc,
    name: "BSC Mainnet",
    chainId: "0x38",
    rpcUrl: "https://bsc-rpc.com",
    blockExplorerUrl: "https://bscscan.com",
    attestationContract: "0x0fEbD23cbefeDF1A65d9FE51a0b6d63C3a477e05",
    nativeCurrency: bsc.nativeCurrency,
  },
  {
    id: "linea-mainnet",
    chain: linea,
    name: "Linea Mainnet",
    chainId: "0x7a69",
    rpcUrl: "https://linea-rpc.com",
    blockExplorerUrl: "https://lineascan.io",
    attestationContract: "0x5AcF01D27F85DA54d34E18A25731f87528f97506",
    nativeCurrency: linea.nativeCurrency,
  },
  {
    id: "arbitrum-mainnet",
    chain: arbitrum,
    name: "Arbitrum Mainnet",
    chainId: "0xa4b1",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io",
    attestationContract: "0xa87B3E7e3bBe0E721309119B610B32683b61db08",
    nativeCurrency: arbitrum.nativeCurrency,
  },
];
