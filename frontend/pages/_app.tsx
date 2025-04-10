import type { AppProps } from "next/app";
import { Web3Provider } from "../providers/web3-provider";
import { AuthProvider } from "../providers/auth-provider";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Web3Provider>
  );
}
