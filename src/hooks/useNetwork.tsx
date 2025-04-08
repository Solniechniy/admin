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
import { useWalletSelector } from "@/provider/near-provider";
import { useAccount } from "wagmi";
import { parseTokenAmount } from "@/lib/utils";

const useNetwork = (network: Network) => {
  const { openModal, RPCProvider, requestSignTransactions } =
    useWalletSelector();
  const { isConnected } = useAccount();
  const { isSignedIn } = useWalletSelector();
  const networkConfig = networks.find((n) => n.id === network) as NetworkConfig;

  return {
    isConnected: () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          return isConnected;
        case Network.NEAR:
          return isSignedIn;
        default:
          return false;
      }
    },
    connectWallet: () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          return <ConnectKitButton />;
        case Network.NEAR:
          return <button onClick={openModal}>Connect</button>;
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
        case Network.NEAR:
          if (!networkConfig?.attestationContract) {
            throw new Error("Attestation contract not found");
          }
          const currentPrices = await RPCProvider.viewFunction(
            "get_prices",
            networkConfig.attestationContract
          );

          await requestSignTransactions([
            {
              receiverId: networkConfig.attestationContract,
              functionCalls: [
                {
                  methodName: "update_costs",
                  args: [
                    type === "create"
                      ? parseTokenAmount(fee, 24)
                      : currentPrices[0],
                    type === "create"
                      ? currentPrices[1]
                      : parseTokenAmount(fee, 24),
                  ],
                },
              ],
            },
          ]);
      }
    },
    getAttestationData: async () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          const createAttestationFee = await readContract(config, {
            abi: hapiProtocolABI,
            address: networkConfig.moduleContract as `0x${string}`,
            functionName: "createAttestationFee",
          });

          const updateAttestationFee = await readContract(config, {
            abi: hapiProtocolABI,
            address: networkConfig.moduleContract as `0x${string}`,
            functionName: "updateAttestationFee",
          });

          const balance = await getBalance(config, {
            address: networkConfig.portalContract as `0x${string}`,
          });

          return {
            balance: balance,
            updateFee: updateAttestationFee,
            createFee: createAttestationFee,
          };
        case Network.NEAR:
          if (!networkConfig?.attestationContract) {
            throw new Error("Attestation contract not found");
          }
          console.log("really here near");
          const prices = await RPCProvider.viewFunction(
            "get_prices",
            networkConfig.attestationContract
          );
          const near_balance = await RPCProvider.viewAccount(
            networkConfig.attestationContract
          );
          console.log(prices, near_balance);
          return {
            balance: near_balance.amount,
            updateFee: prices[0],
            createFee: prices[1],
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
