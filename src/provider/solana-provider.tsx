import { Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import { PropsWithChildren, useMemo } from "react";
import { utils } from "@coral-xyz/anchor";
import { AnchorProvider, BN, Program, Wallet, web3 } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  closeAccount,
  createAccount,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  HapiSolanaAttestation,
  IDL,
} from "../config/interfaces/solana-contract-idl";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export const SolanaProvider = ({ children }: PropsWithChildren) => {
  // const network = WalletAdapterNetwork.Mainnet;

  //   const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint =
    "https://mainnet.helius-rpc.com/?api-key=e5134d0c-9f20-48b6-ada5-33583b7f78fc";
  const wallets = useMemo(() => [new PhantomWalletAdapter() as Adapter], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export function padBuffer(buffer: Buffer | Uint8Array, targetSize: number) {
  if (!(buffer instanceof Buffer)) {
    buffer = Buffer.from(buffer);
  }

  if (buffer.byteLength > targetSize) {
    throw new RangeError(`Buffer is larger than target size: ${targetSize}`);
  }

  return Buffer.concat(
    [buffer, Buffer.alloc(targetSize - buffer.byteLength)],
    targetSize
  );
}

export function bufferFromString(str: string, bufferSize?: number) {
  const utf = utils.bytes.utf8.encode(str);

  if (!bufferSize || utf.byteLength === bufferSize) {
    return Buffer.from(utf);
  }

  if (bufferSize && utf.byteLength > bufferSize) {
    throw RangeError("Buffer size too small to fit the string");
  }

  return padBuffer(utf, bufferSize);
}

export class AttestationProgram {
  protected program: Program<HapiSolanaAttestation>;
  protected connection: web3.Connection;
  protected wallet: NodeWallet;

  constructor(
    connection: web3.Connection,
    wallet: Wallet,
    contractAddress: string
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(IDL, new PublicKey(contractAddress), provider);
    this.wallet = wallet;
    this.connection = connection;
  }

  public findContractStateAddress(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [bufferFromString("state")],
      this.program.programId
    );
  }

  public async getContractStateData() {
    const [state] = this.findContractStateAddress();
    return await this.program.account.state.fetch(state);
  }

  public async withdraw(account: string) {
    const sender = this.program.provider.publicKey;
    if (!sender) return;
    const stateData = await this.getContractStateData();
    const address = stateData.authority.toBase58();
    console.log("authority", address);
    const ata = await getAssociatedTokenAddressSync(
      NATIVE_MINT,
      new PublicKey(address)
    );
    console.log("ata", ata.toBase58());

    const withdrawInstruction = createCloseAccountInstruction(
      ata,
      new PublicKey(account),
      new PublicKey(sender)
    );

    const createAccountInstruction = createAssociatedTokenAccountInstruction(
      new PublicKey(sender),
      ata,
      new PublicKey(sender),
      NATIVE_MINT
    );

    const messageV0 = new web3.TransactionMessage({
      payerKey: sender,
      recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
      instructions: [withdrawInstruction, createAccountInstruction],
    }).compileToV0Message();

    const transaction = new web3.VersionedTransaction(messageV0);

    if (!this.program.provider.sendAndConfirm) {
      return false;
    }
    const latestBlockHash = await this.connection.getLatestBlockhash();

    try {
      const tx = await this.program.provider.sendAndConfirm(
        transaction,
        undefined,
        { maxRetries: 3 }
      );
      const signature = tx;
      await this.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });

      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }

  public async checkATA(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = false
  ) {
    const associatedToken = getAssociatedTokenAddressSync(
      mint,
      owner,
      allowOwnerOffCurve,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    let account;
    try {
      account = await getAccount(
        this.program.provider.connection,
        associatedToken
      );
    } catch (error: unknown) {
      return;
    }

    return account;
  }

  public async getAttestationFee() {
    const [state] = this.findContractStateAddress();
    return await this.program.account.state.fetch(state);
  }

  public async updateAttestationFee(feeAmount: BN, type: "create" | "update") {
    const sender = this.program.provider.publicKey;
    if (!sender) return;

    const [state] = this.findContractStateAddress();

    const updateFeeInstruction =
      type === "create"
        ? await this.program.methods
            .setCreateAttestationFee(feeAmount)
            .accounts({ state })
            .instruction()
        : await this.program.methods
            .setUpdateAttestationFee(feeAmount)
            .accounts({ state })
            .instruction();

    const messageV0 = new web3.TransactionMessage({
      payerKey: sender,
      recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
      instructions: [updateFeeInstruction],
    }).compileToV0Message();

    const transaction = new web3.VersionedTransaction(messageV0);

    if (!this.program.provider.sendAndConfirm) {
      return false;
    }
    const latestBlockHash = await this.connection.getLatestBlockhash();

    try {
      const tx = await this.program.provider.sendAndConfirm(
        transaction,
        undefined,
        { maxRetries: 3 }
      );
      const signature = tx;
      await this.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });

      return true;
    } catch (e: unknown) {
      console.error(e);
      return false;
    }
  }
}
