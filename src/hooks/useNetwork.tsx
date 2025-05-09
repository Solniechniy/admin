import { NetworkConfig, networks, networksMap } from "@/config/networks";

import hapiProtocolABI from "@/config/interfaces/evm-module-abi";
import hapiEVMAbiNative from "@/config/interfaces/evm-native-abi";

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
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { AttestationProgram } from "@/provider/solana-provider";
import { BN, Wallet } from "@coral-xyz/anchor";
import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";

import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import {
  HapiTonAttestation,
  publicClient,
  createTonSender,
  DEFAULT_GAS,
} from "@/provider/ton-provider";
import { address, toNano } from "@ton/core";

const useNetwork = (network: Network) => {
  const { openModal, RPCProvider, requestSignTransactions } =
    useWalletSelector();
  const { isConnected } = useAccount();
  const { selector } = useWalletSelector();
  const { publicKey } = useWallet();
  const networkConfig = networks.find((n) => n.id === network) as NetworkConfig;
  const [isNearConnected, setIsNearConnected] = useState(false);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const tonWallet = useTonWallet();

  const [tonConnectUI] = useTonConnectUI();
  const attestationAdaptor = new AttestationProgram(
    connection,
    wallet as Wallet,
    networksMap[Network.SOLANA].attestationContract as string
  );

  const updateIsNearConnected = async () => {
    if (selector) {
      try {
        const wallet = await selector.wallet();
        const accounts = await wallet?.getAccounts();
        setIsNearConnected(accounts && accounts.length > 0);
      } catch (e) {
        console.warn("Error updating near connected", e);
        setIsNearConnected(false);
      }
    }
  };

  useEffect(() => {
    updateIsNearConnected();
  }, [updateIsNearConnected, selector]);

  return {
    isConnected: () => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
        case Network.ETHEREUM:
          return isConnected;
        case Network.NEAR:
          return isNearConnected;
        case Network.SOLANA:
          return Boolean(publicKey);
        case Network.TON:
          return Boolean(tonWallet);
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
        case Network.ETHEREUM:
          return <ConnectKitButton />;
        case Network.NEAR:
          return <button onClick={openModal}>Connect</button>;
        case Network.SOLANA:
          return <WalletMultiButton />;
        case Network.TON:
          return <TonConnectButton />;
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
        case Network.ETHEREUM:
        case Network.BSC_TESTNET:
          const updateAttestationFeeNative = await writeContract(config, {
            abi: hapiEVMAbiNative,
            address: networkConfig.attestationContract as `0x${string}`,
            functionName: type === "create" ? "setMintCost" : "setRemintCost",
            args: [parseEther(fee)],
          });

          const txNative = await waitForTransactionReceipt(config, {
            hash: updateAttestationFeeNative,
          });
          return txNative;

        case Network.NEAR:
          if (!networkConfig?.attestationContract) {
            throw new Error("Attestation contract not found");
          }
          const currentPrices = await RPCProvider.viewFunction(
            "get_prices",
            networkConfig.attestationContract
          );

          return await requestSignTransactions([
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
        case Network.SOLANA:
          await attestationAdaptor.updateAttestationFee(
            new BN(
              parseTokenAmount(fee, networkConfig.nativeCurrency.decimals)
            ),
            type
          );
          break;
        case Network.TON:
          const hapiTonContract = HapiTonAttestation.createFromAddress(
            networksMap[Network.TON].attestationContract as string
          );
          type === "create"
            ? await hapiTonContract.sendChangeCreateAttestationFee(
                createTonSender(tonConnectUI),
                {
                  value: DEFAULT_GAS,
                  amount: toNano(fee),
                }
              )
            : await hapiTonContract.sendChangeUpdateAttestationFee(
                createTonSender(tonConnectUI),
                {
                  value: DEFAULT_GAS,
                  amount: toNano(fee),
                }
              );
          break;
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
            balance: balance.value,
            updateFee: updateAttestationFee,
            createFee: createAttestationFee,
          };
        case Network.ETHEREUM:
          const createAttestationFeeNative = await readContract(config, {
            abi: hapiEVMAbiNative,
            address: networkConfig.attestationContract as `0x${string}`,
            functionName: "mintCost",
          });

          const updateAttestationFeeNative = await readContract(config, {
            abi: hapiEVMAbiNative,
            address: networkConfig.attestationContract as `0x${string}`,
            functionName: "remintCost",
          });

          const balanceNative = await getBalance(config, {
            address: networkConfig.portalContract as `0x${string}`,
          });

          return {
            balance: balanceNative.value,
            updateFee: updateAttestationFeeNative,
            createFee: createAttestationFeeNative,
          };
        case Network.NEAR:
          if (!networkConfig?.attestationContract) {
            throw new Error("Attestation contract not found");
          }
          const prices = await RPCProvider.viewFunction(
            "get_prices",
            networkConfig.attestationContract
          );
          const near_balance = await RPCProvider.viewAccount(
            networkConfig.attestationContract
          );
          return {
            balance: near_balance.amount,
            updateFee: prices[1],
            createFee: prices[0],
          };
        case Network.SOLANA:
          const fee = await attestationAdaptor.getAttestationFee();
          const stateData = await attestationAdaptor.getContractStateData();
          const ata = await getAssociatedTokenAddressSync(
            NATIVE_MINT,
            stateData.authority
          );
          const solanaBalance = await connection.getBalance(ata);
          console.log(solanaBalance);
          return {
            balance: solanaBalance,
            updateFee: fee.updateAttestationFee,
            createFee: fee.createAttestationFee,
          };
        case Network.TON:
          const hapiTonContract = HapiTonAttestation.createFromAddress(
            networksMap[Network.TON].attestationContract as string
          );
          const tonUpdateFee = await hapiTonContract.getUpdateAttestationFee();
          const tonCreateFee = await hapiTonContract.getCreateAttestationFee();
          const { balance: balanceTon } =
            await publicClient.accounts.getAccount(
              address(networksMap[Network.TON].attestationContract as string)
            );
          console.log(balanceTon, tonUpdateFee, tonCreateFee);
          return {
            balance: balanceTon,
            updateFee: tonUpdateFee,
            createFee: tonCreateFee,
          };

        default:
          throw new Error("Network not supported");
      }
    },
    withdrawBalance: async (
      address: `0x${string}` | string,
      amount: string
    ) => {
      switch (network) {
        case Network.BASE:
        case Network.BSC:
        case Network.LINEA:
        case Network.ARBITRUM:
        case Network.BSC_TESTNET:
          const withdrawBalance = await writeContract(config, {
            abi: evmPortalABI,
            address: networkConfig.portalContract as `0x${string}`,
            functionName: "withdraw",
            args: [
              address,
              parseTokenAmount(amount, networkConfig.nativeCurrency.decimals),
            ],
          });

          const tx = await waitForTransactionReceipt(config, {
            hash: withdrawBalance,
          });
          return tx;
        case Network.ETHEREUM:
          const withdrawBalanceNative = await writeContract(config, {
            abi: hapiEVMAbiNative,
            address: networkConfig.attestationContract as `0x${string}`,
            functionName: "withdraw",
            args: [address],
          });

          const txNative = await waitForTransactionReceipt(config, {
            hash: withdrawBalanceNative,
          });
          return txNative;

        case Network.NEAR:
          if (!networkConfig?.attestationContract) {
            throw new Error("Attestation contract not found");
          }
          await requestSignTransactions([
            {
              receiverId: networkConfig.attestationContract,
              functionCalls: [
                {
                  methodName: "withdraw",
                  args: [
                    parseTokenAmount(
                      amount,
                      networkConfig.nativeCurrency.decimals
                    ),
                    address,
                  ],
                },
              ],
            },
          ]);
          break;
        case Network.SOLANA:
          await attestationAdaptor.withdraw(address);
          break;
        case Network.TON:
          const hapiTonContract = HapiTonAttestation.createFromAddress(
            networksMap[Network.TON].attestationContract as string
          );
          await hapiTonContract.sendWithdraw(createTonSender(tonConnectUI), {
            value: DEFAULT_GAS,
            amount: toNano(amount),
          });
          break;
        default:
          throw new Error("Network not supported");
      }
    },
  };
};

export default useNetwork;
