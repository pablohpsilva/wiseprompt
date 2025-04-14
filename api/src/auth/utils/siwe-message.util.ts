import { ConfigService } from "@nestjs/config";
import { SiweMessage } from "siwe";

export const createSiweMessage = (
  address: string,
  nonce: string,
  configService: ConfigService
): SiweMessage => {
  const domain = configService.get("DOMAIN") || "wiseprompt.io";
  const origin = configService.get("ORIGIN") || "https://wiseprompt.io";

  return new SiweMessage({
    domain,
    // address: address.toLowerCase(),
    address,
    statement: "Sign in with Ethereum to WisePrompt",
    uri: origin,
    version: "1",
    chainId: 1, // Ethereum mainnet
    nonce,
  });
};

export const getSiweMessageString = (
  address: string,
  nonce: string,
  configService: ConfigService
): string => {
  const message = createSiweMessage(address, nonce, configService);
  return message.prepareMessage();
};
