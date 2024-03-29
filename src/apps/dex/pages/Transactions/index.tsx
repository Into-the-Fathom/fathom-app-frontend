import { useEffect, useState, memo, useMemo, FC } from "react";
import { useLazyQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, styled } from "@mui/material";

import AppBody from "apps/dex/pages/AppBody";
import { Wrapper } from "apps/dex/pages/Pool/styleds";
import { USER_TRANSACTIONS } from "apps/charts/apollo/queries";
import { TXN_TYPE } from "apps/charts/components/TxnList";
import {
  isTransactionRecent,
  useAllTransactions,
} from "apps/dex/state/transactions/hooks";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";
import {
  Transaction,
  PreviousTransaction,
  FormattedTransaction,
  TransactionItem,
  SwapTransactionItem,
} from "apps/dex/components/Transactions/Transaction";
import { TYPE } from "apps/dex/theme";
import { useActiveWeb3React } from "apps/dex/hooks";
import {
  CircleWrapper,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";

const TransactionListWrapper = styled(Box)`
  display: flex;
  flex-flow: column nowrap;
`;

const TransactionsHeaderRow = styled(Box)`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  padding: 1rem 0 0.5rem;
  color: #fafafa;
`;

const EmptyTransactionsRow = styled(Box)`
  display: flex;
  justify-content: center;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  padding: 16px 0;
`;

function newTransactionsFirst(
  a: TransactionDetails | FormattedTransaction,
  b: TransactionDetails | FormattedTransaction
) {
  return b.addedTime - a.addedTime;
}

export enum TransactionType {
  STORAGE,
  GRAPH,
}

const Transactions: FC = () => {
  const [transactionList, setTransactionList] = useState<
    FormattedTransaction[]
  >([]);

  const [sortedFilteredTransactions, setSortedFilteredTransactions] = useState<
    (TransactionDetails | FormattedTransaction)[]
  >([]);

  const { account } = useActiveWeb3React();
  const [getTransactions, { loading }] = useLazyQuery(USER_TRANSACTIONS, {
    fetchPolicy: "cache-first",
    onCompleted: (transactions) => {
      setSortedFilteredTransactions([]);
      if (
        transactions &&
        transactions.mints &&
        transactions.burns &&
        transactions.swaps
      ) {
        const newTxns: FormattedTransaction[] = [];
        if (transactions.mints.length > 0) {
          transactions.mints.map((mint: TransactionItem) => {
            const newTxn = {
              hash: mint.transaction.id,
              addedTime: Number(mint.transaction.timestamp) * 1000,
              type: TXN_TYPE.ADD,
              token0Amount: mint.amount0,
              token1Amount: mint.amount1,
              token0Symbol: mint.pair.token0.symbol,
              token1Symbol: mint.pair.token1.symbol,
              transactionType: TransactionType.GRAPH,
            };
            return newTxns.push(newTxn);
          });
        }
        if (transactions.burns.length > 0) {
          transactions.burns.map((burn: TransactionItem) => {
            const newTxn = {
              hash: burn.transaction.id,
              addedTime: Number(burn.transaction.timestamp) * 1000,
              type: TXN_TYPE.REMOVE,
              token0Amount: burn.amount0,
              token1Amount: burn.amount1,
              token0Symbol: burn.pair.token0.symbol,
              token1Symbol: burn.pair.token1.symbol,
              transactionType: TransactionType.GRAPH,
            };
            return newTxns.push(newTxn);
          });
        }
        if (transactions.swaps.length > 0) {
          transactions.swaps.map((swap: SwapTransactionItem) => {
            const netToken0 = swap.amount0In - swap.amount0Out;
            const netToken1 = swap.amount1In - swap.amount1Out;

            const newTxn = {
              token0Symbol: "",
              token1Symbol: "",
              token0Amount: 0,
              token1Amount: 0,
              hash: swap.transaction.id,
              addedTime: Number(swap.transaction.timestamp) * 1000,
              type: TXN_TYPE.SWAP,
              transactionType: TransactionType.GRAPH,
            };

            if (netToken0 < 0) {
              newTxn.token0Symbol = swap.pair.token0.symbol;
              newTxn.token1Symbol = swap.pair.token1.symbol;
              newTxn.token0Amount = Math.abs(netToken0);
              newTxn.token1Amount = Math.abs(netToken1);
            } else if (netToken1 < 0) {
              newTxn.token0Symbol = swap.pair.token1.symbol;
              newTxn.token1Symbol = swap.pair.token0.symbol;
              newTxn.token0Amount = Math.abs(netToken1);
              newTxn.token1Amount = Math.abs(netToken0);
            }

            return newTxns.push(newTxn);
          });
        }

        setTransactionList(newTxns);
      } else {
        setTransactionList([]);
      }
    },
  });

  const storageTransactions = useAllTransactions();

  const allTransactions = useMemo(() => {
    if (account) {
      const filtered = Object.entries(storageTransactions).filter(
        ([, tx]) => tx.from?.toLowerCase() === account?.toLowerCase()
      );
      return Object.fromEntries(filtered);
    } else {
      return {};
    }
  }, [storageTransactions, account]);

  /**
   * Get transactions for the last 7 days.
   */
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs
      .filter((tx) => isTransactionRecent(tx, 7))
      .sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = useMemo(() => {
    return sortedRecentTransactions
      .filter((tx) => !tx.receipt)
      .map((tx) => tx.hash);
  }, [sortedRecentTransactions]);

  useEffect(() => {
    if (account) {
      getTransactions({
        variables: { user: account },
      });
    }
  }, [account, getTransactions]);

  useEffect(() => {
    if (!transactionList.length && !sortedRecentTransactions.length) {
      return;
    }

    const transactionListHashCollection = transactionList.map(
      (transaction) => transaction.hash
    );
    const confirmed = sortedRecentTransactions
      .filter((tx) => tx.receipt)
      .map((tx) => tx.hash);

    const confirmedCollection = confirmed
      .filter((hash) => !transactionListHashCollection.includes(hash))
      .map((hash: string) => allTransactions?.[hash]);

    const sortedArray = [...confirmedCollection, ...transactionList].sort(
      newTransactionsFirst
    );

    setSortedFilteredTransactions(sortedArray);
  }, [
    transactionList,
    sortedRecentTransactions,
    allTransactions,
    setSortedFilteredTransactions,
  ]);

  if (!account) {
    return <Navigate to={"/swap"} />;
  }

  return (
    <AppBody>
      <Wrapper id={"transaction-list"}>
        <TransactionsHeaderRow>
          <TYPE.white fontSize={20}>Transactions</TYPE.white>
        </TransactionsHeaderRow>
        {pending.length || sortedFilteredTransactions.length ? (
          <>
            <TransactionListWrapper>
              {pending.map((hash) => {
                return <Transaction key={hash} tx={allTransactions?.[hash]} />;
              })}
            </TransactionListWrapper>
            <TransactionListWrapper>
              {sortedFilteredTransactions.map((item) => {
                return item?.transactionType === TransactionType.GRAPH ? (
                  <PreviousTransaction
                    item={item as FormattedTransaction}
                    key={item.hash}
                  />
                ) : (
                  <Transaction
                    tx={item as TransactionDetails}
                    key={item.hash}
                  />
                );
              })}
            </TransactionListWrapper>
          </>
        ) : loading ? (
          <NoResults mt={3}>
            <CircleWrapper>
              <CircularProgress size={30} />
            </CircleWrapper>
          </NoResults>
        ) : (
          <EmptyTransactionsRow>
            <TYPE.body>There are no transactions yet</TYPE.body>
          </EmptyTransactionsRow>
        )}
      </Wrapper>
    </AppBody>
  );
};

export default memo(Transactions);
