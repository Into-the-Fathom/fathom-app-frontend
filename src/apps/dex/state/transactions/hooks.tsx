import { TransactionResponse } from "@into-the-fathom/providers";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useActiveWeb3React } from "apps/dex/hooks";
import { AppDispatch, AppState } from "apps/dex/state";
import { addTransaction } from "apps/dex/state/transactions/actions";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";

// helper that can take a fathom-ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string;
    approval?: { tokenAddress: string; spender: string };
    claim?: { recipient: string };
  }
) => void {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        approval,
        claim,
      }: {
        summary?: string;
        claim?: { recipient: string };
        approval?: { tokenAddress: string; spender: string };
      } = {}
    ) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error("No transaction hash found.");
      }
      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
          claim,
        })
      );
    },
    [dispatch, chainId, account]
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): {
  [txHash: string]: TransactionDetails;
} {
  const { chainId } = useActiveWeb3React();

  const state = useSelector<AppState, AppState["transactions"]>(
    (state) => state.transactions
  );

  return chainId ? state[chainId] ?? {} : {};
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency.
 * @param days - days for retrieve transactions.
 */
export function isTransactionRecent(tx: TransactionDetails, days = 1): boolean {
  return new Date().getTime() - tx.addedTime < days * 86_400_000;
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
  tokenAddress: string | undefined,
  spender: string | undefined
): boolean {
  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      typeof tokenAddress === "string" &&
      typeof spender === "string" &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          const approval = tx.approval;
          if (!approval) return false;
          return (
            approval.spender === spender &&
            approval.tokenAddress === tokenAddress &&
            isTransactionRecent(tx)
          );
        }
      }),
    [allTransactions, spender, tokenAddress]
  );
}
