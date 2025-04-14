import { IsString, IsEthereumAddress, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SiweMessage } from "siwe";

export class VerifySignatureDto {
  @ApiProperty({
    description: "Ethereum address of the signer",
    example: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  })
  @IsEthereumAddress()
  address: string;

  @ApiProperty({
    description: "Signature of the message",
    example: "0x...",
  })
  @IsString()
  @Length(1, 200)
  signature: string;

  @ApiProperty({
    description: "Nonce used in the signing process",
    example: "a1b2c3d4e5f6...",
  })
  @IsString()
  @Length(1, 100)
  nonce: string;

  @ApiProperty({
    description: "Message that was signed",
    example: "Hello, world!",
  })
  @IsString()
  message: string;
}
