"use client";

import { useEffect, useState } from "react";
import { NetworkSelector } from "@/components/network-selector";
import { WalletConnector } from "@/components/wallet-connector";
import { AdminPanel } from "@/components/admin-panel";
import type { NetworkConfig } from "@/config/networks";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";
import { useSwitchChain } from "wagmi";
import { switchChain } from "@wagmi/core";

export default function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig | null>(
    null
  );
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { isPending } = useSwitchChain();
  const handleNetworkChange = (network: NetworkConfig | null) => {
    setSelectedNetwork(network);
    setIsWalletConnected(false);
  };

  useEffect(() => {
    const switchChain = async (id: number) => {
      await switchChain(id);
    };

    if (selectedNetwork && chainId !== selectedNetwork.chain.id && !isPending) {
      switchChain(selectedNetwork.chain.id);
    }
  }, [chainId, selectedNetwork]);

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Left Panel - Network & Wallet */}
      <div className="w-full md:w-1/2 p-6 border-r">
        <h1 className="text-xl font-bold mb-6">Attestation Admin</h1>

        <div className="space-y-6">
          <NetworkSelector
            onNetworkChange={handleNetworkChange}
            selectedNetwork={selectedNetwork}
          />

          {selectedNetwork && <WalletConnector />}
        </div>
      </div>

      {/* Right Panel - Admin Controls */}
      <div className="w-full md:w-1/2 p-6">
        {isConnected && selectedNetwork ? (
          <AdminPanel network={selectedNetwork} walletAddress={address!} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              {!selectedNetwork
                ? "Please select a network to continue"
                : "Please connect your wallet to access admin controls"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
