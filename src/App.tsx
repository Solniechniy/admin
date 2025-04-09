import { useState } from "react";
import { NetworkSelector } from "@/components/network-selector";
import { WalletConnector } from "@/components/wallet-connector";
import { AdminPanel } from "@/components/admin-panel";
import type { Network, NetworkConfig } from "@/config/networks";
import { useAccount } from "wagmi";

import { config } from "@/config/networks";
import { switchChain } from "@wagmi/core";
import useNetwork from "./hooks/useNetwork";

export default function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig | null>(
    null
  );

  const { address } = useAccount();
  const { isConnected } = useNetwork(selectedNetwork?.id as Network);

  const handleNetworkChange = async (network: NetworkConfig | null) => {
    try {
      if (network) {
        setSelectedNetwork(network);
        await switchChain(config, {
          chainId: network.chain.id,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

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

          {selectedNetwork && <WalletConnector network={selectedNetwork} />}
        </div>
      </div>

      {/* Right Panel - Admin Controls */}
      <div className="w-full md:w-1/2 p-6">
        {isConnected() && selectedNetwork ? (
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
