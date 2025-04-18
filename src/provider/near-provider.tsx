import React, { useCallback, useContext, useEffect, useState } from "react";

import { map, distinctUntilChanged } from "rxjs/operators";
import {
  FinalExecutionOutcome,
  NetworkId,
  setupWalletSelector,
  Transaction,
  WalletSelectorState,
} from "@near-wallet-selector/core";
import type {
  WalletSelector,
  AccountState,
  WalletModuleFactory,
  BrowserWallet,
} from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { providers, utils } from "near-api-js";
import BN from "bn.js";

import { Network, networks } from "@/config/networks";
import { AccountView, CodeResult } from "near-api-js/lib/providers/provider";
import "@near-wallet-selector/modal-ui/styles.css";

export const getGas = (gas?: string) =>
  gas ? new BN(gas) : new BN("100000000000000");
export const getAmount = (amount?: string) =>
  amount ? new BN(utils.format.parseNearAmount(amount) ?? 0) : new BN("0");

export interface ITransaction {
  receiverId: string;
  functionCalls: {
    gas?: string;
    amount?: string;
    methodName: string;
    args?: object;
  }[];
}

export interface IRPCProviderService {
  viewFunction: (method: string, accountId: string, args?: any) => Promise<any>;
  viewAccount: (accountId: string) => Promise<any>;
}

enum RPCProviderMethods {
  CALL_FUNCTION = "call_function",
  VIEW_ACCOUNT = "view_account",
}

const FINALITY_FINAL = "final";

export default class RPCProviderService implements IRPCProviderService {
  private provider?: providers.JsonRpcProvider;

  constructor(provider?: providers.JsonRpcProvider) {
    this.provider = provider;
  }

  async viewFunction(method: string, accountId: string, args: any = {}) {
    try {
      if (!this.provider) return console.warn("No Provider selected");

      const response = await this.provider.query<CodeResult>({
        request_type: RPCProviderMethods.CALL_FUNCTION,
        account_id: accountId,
        method_name: method,
        args_base64: btoa(JSON.stringify(args || {})),
        finality: FINALITY_FINAL,
      });

      const result = JSON.parse(Buffer.from(response.result).toString());
      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async viewAccount(accountId: string) {
    try {
      if (!this.provider) return console.warn("No Provider selected");
      const response = await this.provider.query<AccountView>({
        request_type: RPCProviderMethods.VIEW_ACCOUNT,
        finality: FINALITY_FINAL,
        account_id: accountId,
      });

      return response;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}

const NEAR_CONFIG = networks.find((network) => network.id === Network.NEAR);

const CONTRACT_ID = NEAR_CONFIG?.attestationContract;
const NETWORK_ID = "mainnet";

interface WalletSelectorContextValue {
  openModal: () => void;
  selector: WalletSelector | null;
  requestSignTransactions: (
    t: ITransaction[]
  ) => Promise<void | FinalExecutionOutcome[]>;
  accountId: string;
  RPCProvider: IRPCProviderService;
  signOut: () => Promise<void>;
  lastTransaction: number;
}

const WalletSelectorContext = React.createContext<WalletSelectorContextValue>(
  {} as WalletSelectorContextValue
);

export const WalletSelectorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [RPCProvider, setRPCProvider] = useState<IRPCProviderService>(
    new RPCProviderService()
  );
  const [lastTransaction, setLastTransaction] = useState<number>(Date.now());

  const syncAccountState = (
    currentAccountId: string | null,
    newAccounts: Array<AccountState>
  ) => {
    if (!newAccounts.length) {
      localStorage.removeItem("accountId");
      setAccountId("");

      return;
    }

    const validAccountId =
      currentAccountId &&
      newAccounts.some((x) => x.accountId === currentAccountId);
    const newAccountId = validAccountId
      ? currentAccountId
      : newAccounts[0].accountId;

    localStorage.setItem("accountId", newAccountId);
    setAccountId(newAccountId);
  };

  const init = useCallback(async () => {
    const selectorInstance = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [setupMyNearWallet() as WalletModuleFactory<BrowserWallet>],
    });
    const modalInstance = setupModal(selectorInstance, {
      contractId: CONTRACT_ID as string,
    });
    const state = selectorInstance.store.getState();
    syncAccountState(localStorage.getItem("accountId"), state.accounts);

    window.selector = selectorInstance;
    window.modal = modalInstance;

    const { network } = selectorInstance.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const providerService = new RPCProviderService(provider);
    setRPCProvider(providerService);
    setSelector(selectorInstance);
    setModal(modalInstance);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = (selector.store.observable as any)
      .pipe(
        map((state: WalletSelectorState) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts: AccountState[]) => {
        syncAccountState(accountId, nextAccounts);
      });

    // eslint-disable-next-line consistent-return
    return () => subscription.unsubscribe();
  }, [selector, accountId]);

  const requestSignTransactions = useCallback(
    async (transactions: ITransaction[]) => {
      if (!selector) return console.warn("No wallet selected");

      const nearTransactions: Transaction[] = transactions.map(
        (transaction: ITransaction) => ({
          signerId: accountId,
          receiverId: transaction.receiverId,
          actions: transaction.functionCalls.map((fc) => ({
            type: "FunctionCall",
            params: {
              methodName: fc.methodName,
              args: fc.args || {},
              gas: getGas(fc.gas).toString(),
              deposit: getAmount(fc.amount).toString(),
            },
          })),
        })
      );

      const walletInstance = await selector.wallet();
      const result = await walletInstance.signAndSendTransactions({
        transactions: nearTransactions,
      });
      setLastTransaction(Date.now());
      return result;
    },
    [selector, accountId]
  );

  const openModal = useCallback(() => {
    if (!modal) return;

    modal.show();
  }, [modal]);

  const signOut = useCallback(async () => {
    try {
      if (!selector) return;
      const wallet = await selector.wallet();

      await wallet.signOut();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }, [selector]);

  if (!selector || !modal) {
    return null;
  }

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        accountId,
        openModal,
        requestSignTransactions,
        RPCProvider,
        signOut,
        lastTransaction,
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  return useContext(WalletSelectorContext);
}
