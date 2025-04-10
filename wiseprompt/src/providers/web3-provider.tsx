"use client";

import { ReactNode } from "react";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, optimism, polygon, arbitrum, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import RainbowKit styles
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "WisePrompt",
  projectId: "YOUR_PROJECT_ID", // Get a project ID from WalletConnect Cloud
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

type Web3ProviderProps = {
  children: ReactNode;
};

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
