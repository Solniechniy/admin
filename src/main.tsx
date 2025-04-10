import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { WalletSelectorContextProvider } from "./provider/near-provider.tsx";
import { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { WalletSelector } from "@near-wallet-selector/core";
import { SolanaProvider } from "./provider/solana-provider.tsx";

const queryClient = new QueryClient();

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaProvider>
      <WagmiProvider config={config}>
        <WalletSelectorContextProvider>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              <App />
            </ConnectKitProvider>
          </QueryClientProvider>
        </WalletSelectorContextProvider>
      </WagmiProvider>
    </SolanaProvider>
  </StrictMode>
);
