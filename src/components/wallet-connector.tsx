import { ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Network, NetworkConfig, networks } from "@/config/networks";

import { useAccount, useChainId } from "wagmi";
import useNetwork from "@/hooks/useNetwork";

export function WalletConnector({ network }: { network: NetworkConfig }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { connectWallet } = useNetwork(network.id as Network);

  const currentNetwork = networks.find((n) => n.chain.id === chainId);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Step 2: Connect Wallet</h2>

      {!isConnected ? (
        connectWallet()
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connected to:</span>
                <span className="text-sm text-green-500">
                  {currentNetwork?.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Address:</span>
                <div className="flex items-center">
                  <span className="text-sm truncate max-w-[150px]">
                    {currentNetwork?.moduleContract}
                  </span>
                  {currentNetwork?.blockExplorerUrl && (
                    <a
                      href={`${currentNetwork?.blockExplorerUrl}/address/${currentNetwork?.moduleContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
