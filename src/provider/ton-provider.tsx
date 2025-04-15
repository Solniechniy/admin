import { SenderArguments, toNano } from "@ton/core";

export const TON_DEFAULT_GAS = toNano("0.05");
export const TON_MIN_COMMISSION = toNano("0.01");
export const TON_MIN_JETTON_STORAGE = toNano("0.001");

import {
  Address,
  Cell,
  Contract,
  ContractProvider,
  SendMode,
  Sender,
  beginCell,
  address as toAddress,
} from "@ton/core";

import { TonApiClient, Api } from "@ton-api/client";
import { ContractAdapter } from "@ton-api/ton-adapter";
import { TonConnectUI } from "@tonconnect/ui-react";

export const DEFAULT_GAS = toNano("0.05");

export const createTonSender = (tonClient: TonConnectUI): Sender => {
  return {
    send: async (args: SenderArguments) => {
      try {
        await tonClient.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });
      } catch (e) {
        console.error(e);
      }
    },
  };
};

const httpClient = new TonApiClient({
  baseUrl: "https://tonapi.io",
  baseApiParams: {
    headers: {
      Authorization: `Bearer AE5MP66NI5OVIDIAAAAB5BIW53F77XGUIWDAN2KOCUAQDYEXEEE3AKTAZBKBUNEQ2XBYNNI`,
      "Content-type": "application/json",
    },
  },
});
export const publicClient = new Api(httpClient);
export const contractAdapter = new ContractAdapter(publicClient);

const POLYNOMIAL = -306674912;

let crc32_table: Int32Array | undefined = undefined;

export function crc32(str: string, crc = 0xffffffff) {
  let bytes = Buffer.from(str);
  if (crc32_table === undefined) {
    calcTable();
  }
  for (let i = 0; i < bytes.length; ++i)
    crc = crc32_table![(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function calcTable() {
  crc32_table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let r = i;
    for (let bit = 8; bit > 0; --bit)
      r = r & 1 ? (r >>> 1) ^ POLYNOMIAL : r >>> 1;
    crc32_table[i] = r;
  }
}

export const OpCode = {
  changeCreateAttestationFee: crc32("change_create_attestation_fee"),
  changeUpdateAttestationFee: crc32("change_update_attestation_fee"),
  withdrawFunds: crc32("withdraw_funds"),
};

export class HapiTonAttestation implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: string) {
    return contractAdapter.open(new HapiTonAttestation(toAddress(address)));
  }

  async getCreateAttestationFee(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get("get_create_attestation_fee", []);
    return result.stack.readBigNumber();
  }

  async getUpdateAttestationFee(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get("get_update_attestation_fee", []);
    return result.stack.readBigNumber();
  }

  async sendChangeCreateAttestationFee(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      amount: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(OpCode.changeCreateAttestationFee, 32)
        .storeCoins(opts.amount)
        .endCell(),
    });
  }

  async sendChangeUpdateAttestationFee(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      amount: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(OpCode.changeUpdateAttestationFee, 32)
        .storeCoins(opts.amount)
        .endCell(),
    });
  }

  async sendWithdraw(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      amount: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(OpCode.withdrawFunds, 32)
        .storeCoins(opts.amount)
        .endCell(),
    });
  }
}
