import React, { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { SiweMessage } from "siwe";
import axios from "axios";
import { useSignMessage } from "wagmi";

interface User {
  walletAddress: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    if (!address) return;

    try {
      setLoading(true);

      // 1. Get a nonce from the server
      const { data: nonceData } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/nonce`,
        {
          walletAddress: address,
        }
      );
      const { nonce } = nonceData;

      // 2. Create and sign the SIWE message
      const message = new SiweMessage({
        // domain: window.location.host,
        domain: "127.0.0.1",
        scheme: "http",
        address,
        statement: "Sign in with Ethereum to WisePrompt",
        // uri: window.location.origin,
        uri: "http://127.0.0.1:3000",
        version: "1",
        chainId: 1, // Ethereum mainnet
        nonce,
      });

      const messageToSign = message.prepareMessage();

      // 3. Sign the message with the wallet
      const signature = await signMessageAsync({
        account: address,
        message: messageToSign,
      });

      // 4. Verify the signature on the server and get a JWT token
      const { data: verifyData } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          message: messageToSign,
          signature,
          address,
          nonce,
        }
      );

      const { token: newToken } = verifyData;

      // 5. Store the token
      localStorage.setItem("auth_token", newToken);
      setToken(newToken);

      // 6. Set the token in axios defaults for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error) {
      console.error("Authentication error:", error);
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    disconnect();
    delete axios.defaults.headers.common["Authorization"];
  };

  // Create the user object that includes the wallet address and token
  const user = address && token ? { walletAddress: address, token } : null;

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      // Set authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Handle wallet disconnection
  useEffect(() => {
    if (!isConnected && token) {
      logout();
    }
  }, [isConnected, token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
