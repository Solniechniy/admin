import { NetworkConfig, networks } from "@/config/networks";

import hapiProtocolABI from "@/config/interfaces/evm-module-abi";
import { config, Network } from "@/config/networks";
import {
  getBalance,
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { parseEther } from "ethers";
import { ConnectKitButton } from "connectkit";
import evmPortalABI from "@/config/interfaces/evm-portal-abi";

const useNetwork = (network: Network) => {
  return {
    connectWallet: () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          return <ConnectKitButton />;
        default:
          throw new Error("Network not supported");
      }
    },
    switchNetwork: () => {
      switch (network) {
        case Network.BASE:
          return console.log("base");
      }
    },

    updateAttestationFee: async (fee: string, type: "create" | "update") => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          const networkConfig = networks.find(
            (n) => n.id === network
          ) as NetworkConfig;

          const updateAttestationFee = await writeContract(config, {
            abi: hapiProtocolABI,
            address: networkConfig.moduleContract as `0x${string}`,
            functionName:
              type === "create"
                ? "setCreateAttestationFee"
                : "setUpdateAttestationFee",
            args: [parseEther(fee)],
          });

          const tx = await waitForTransactionReceipt(config, {
            hash: updateAttestationFee,
          });
          return tx;
      }
    },
    getAttestationData: async () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          const networkConfig = networks.find(
            (n) => n.id === network
          ) as NetworkConfig;

          const updateAttestationFee = await readContract(config, {
            abi: hapiProtocolABI,
            address: networkConfig.moduleContract as `0x${string}`,
            functionName: "updateAttestationFee",
          });
          const createAttestationFee = await readContract(config, {
            abi: hapiProtocolABI,
            address: networkConfig.moduleContract as `0x${string}`,
            functionName: "createAttestationFee",
          });

          const balance = await getBalance(config, {
            address: networkConfig.portalContract as `0x${string}`,
          });

          return {
            balance: balance,
            updateFee: updateAttestationFee,
            createFee: createAttestationFee,
          };
        default:
          throw new Error("Network not supported");
      }
    },
    withdrawBalance: async () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          const networkConfig = networks.find(
            (n) => n.id === network
          ) as NetworkConfig;

          const withdrawBalance = await writeContract(config, {
            abi: evmPortalABI,
            address: networkConfig.portalContract as `0x${string}`,
            functionName: "withdraw",
            args: [],
          });

          const tx = await waitForTransactionReceipt(config, {
            hash: withdrawBalance,
          });
          return tx;
      }
    },
  };
};

export default useNetwork;
