import { ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { networks } from "@/config/networks";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId } from "wagmi";

export function WalletConnector() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const currentNetwork = networks.find((n) => n.chain.id === chainId);
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Step 2: Connect Wallet</h2>

      {!isConnected ? (
        <ConnectKitButton />
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
                    {currentNetwork?.attestationContract}
                  </span>
                  {currentNetwork?.blockExplorerUrl && (
                    <a
                      href={`${currentNetwork?.blockExplorerUrl}/address/${currentNetwork?.attestationContract}`}
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
