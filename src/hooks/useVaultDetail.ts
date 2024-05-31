import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IVault,
  IVaultPosition,
  IVaultStrategy,
  IVaultStrategyReport,
  SmartContractFactory,
} from "fathom-sdk";
import BigNumber from "bignumber.js";
import { Contract } from "fathom-ethers";
import { useLazyQuery, useQuery } from "@apollo/client";

import { useServices } from "context/services";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import useRpcError from "hooks/useRpcError";
import {
  VAULT,
  VAULT_FACTORIES,
  VAULT_POSITION,
  VAULT_POSITION_TRANSACTIONS,
  VAULT_STRATEGY_REPORTS,
} from "apollo/queries";
import { vaultTitle } from "utils/getVaultTitleAndDescription";
import { FunctionFragment } from "@into-the-fathom/abi";

declare module "fathom-sdk" {
  interface IVault {
    name: string;
  }
}

interface UseVaultDetailProps {
  vaultId: string;
}

export enum VaultInfoTabs {
  ABOUT,
  STRATEGIES,
  MANAGEMENT_VAULT,
  MANAGEMENT_STRATEGY,
}

const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const VAULT_REPORTS_PER_PAGE = 1000;

const VAULT_ABI = SmartContractFactory.FathomVault("").abi;
const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;

export type IVaultStrategyHistoricalApr = {
  id: string;
  apr: string;
  timestamp: string;
};

enum TransactionFetchType {
  FETCH = "fetch",
  PROMISE = "promise",
}

enum FetchBalanceTokenType {
  PROMISE = "promise",
  FETCH = "fetch",
}

const useVaultDetail = ({ vaultId }: UseVaultDetailProps) => {
  const [vault, setVault] = useState<IVault>({} as IVault);
  const [vaultPosition, setVaultPosition] = useState<IVaultPosition>(
    {} as IVaultPosition
  );
  const [balanceToken, setBalanceToken] = useState<string>("0");
  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [transactionsLoading, setTransactionLoading] = useState<boolean>(false);
  const [protocolFee, setProtocolFee] = useState(0);
  const [performanceFee, setPerformanceFee] = useState(0);

  const [reports, setReports] = useState<
    Record<string, IVaultStrategyReport[]>
  >({});

  const [historicalApr, setHistoricalApr] = useState<
    Record<string, IVaultStrategyHistoricalApr[]>
  >({});

  const [managedStrategiesIds, setManagedStrategiesIds] = useState<string[]>(
    []
  );
  const [isUserManager, setIsUserManager] = useState<boolean>(false);

  const { syncVault, prevSyncVault } = useSyncContext();

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    VaultInfoTabs.ABOUT
  );

  const [vaultMethods, setVaultMethods] = useState<FunctionFragment[]>([]);
  const [strategyMethods, setStrategyMethods] = useState<FunctionFragment[]>(
    []
  );

  const { chainId, account, library } = useConnector();
  const { vaultService, poolService } = useServices();
  const { showErrorNotification } = useRpcError();

  const { data: vaultItemData, loading: vaultLoading } = useQuery(VAULT, {
    variables: {
      id: vaultId,
      chainId,
    },
    context: { clientName: "vaults", chainId },
    fetchPolicy: "network-only",
  });

  const [loadPosition, { loading: vaultPositionLoading }] = useLazyQuery(
    VAULT_POSITION,
    {
      context: { clientName: "vaults", chainId },
      fetchPolicy: "no-cache",
    }
  );

  const [loadReports, { fetchMore: fetchMoreReports }] = useLazyQuery(
    VAULT_STRATEGY_REPORTS,
    {
      context: { clientName: "vaults", chainId },
      variables: { chainId },
      fetchPolicy: "no-cache",
    }
  );

  const [loadPositionTransactions, { refetch: refetchTransactions }] =
    useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId },
      fetchPolicy: "no-cache",
    });

  const { data: vaultsFactories, loading: vaultsFactoriesLoading } = useQuery(
    VAULT_FACTORIES,
    {
      context: { clientName: "vaults", chainId },
      fetchPolicy: "network-only",
      variables: {
        chainId,
      },
    }
  );

  const fetchReports = (
    strategyId: string,
    prevStateReports: IVaultStrategyReport[] = [],
    prevStateApr: IVaultStrategyHistoricalApr[] = []
  ) => {
    (!prevStateReports.length ? loadReports : fetchMoreReports)({
      variables: {
        strategy: strategyId,
        reportsFirst: VAULT_REPORTS_PER_PAGE,
        reportsSkip: prevStateReports.length,
        chainId,
      },
    }).then((response) => {
      const { data } = response;

      if (
        data?.strategyReports &&
        data?.strategyReports.length &&
        data?.strategyReports.length % VAULT_REPORTS_PER_PAGE === 0
      ) {
        fetchReports(
          strategyId,
          [...prevStateReports, ...data.strategyReports],
          [...prevStateApr, ...data.strategyHistoricalAprs]
        );
      } else {
        setReports((prev) => ({
          ...prev,
          [strategyId]: [...prevStateReports, ...data.strategyReports],
        }));
        setHistoricalApr((prev) => ({
          ...prev,
          [strategyId]: [...prevStateApr, ...data.strategyHistoricalAprs],
        }));
      }
    });
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (vault && vault?.strategies && vault?.strategies?.length) {
      timeout = setTimeout(() => {
        vault?.strategies.forEach((strategy: IVaultStrategy) => {
          /**
           * Clear reports and historical APRs necessary for chain switch
           */
          setReports((prev) => ({
            ...prev,
            [strategy.id]: [],
          }));
          setHistoricalApr((prev) => ({
            ...prev,
            [strategy.id]: [],
          }));
          fetchReports(strategy.id, [], []);
        });
      }, 500);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vault, chainId]);

  useEffect(() => {
    if (!vaultsFactoriesLoading && vaultsFactories) {
      const { factories, accountants } = vaultsFactories;
      const protocolFeeRes = factories[0].protocolFee;
      const performanceFeeRes = accountants[0].performanceFee;

      if (protocolFeeRes) {
        setProtocolFee(protocolFeeRes / 100);
      }
      if (performanceFeeRes) {
        setPerformanceFee(performanceFeeRes / 100);
      }
    }
  }, [vaultsFactories]);

  useEffect(() => {
    if (vaultItemData) {
      const { vault } = vaultItemData;
      setVault({
        ...vault,
        name: vaultTitle[vault.id.toLowerCase()]
          ? vaultTitle[vault.id.toLowerCase()]
          : vault.token.name,
      });
    }
  }, [vaultItemData, setVault]);

  const updateVaultPosition = async (position: IVaultPosition) => {
    try {
      const balance = await poolService.getUserTokenBalance(
        account,
        position.shareToken.id
      );

      const previewRedeemValue = await vaultService.previewRedeem(
        balance.toString(),
        position.vault.id
      );

      console.log("balance", balance.toString());
      console.log("previewRedeemValue", previewRedeemValue.toString());

      const updatedVaultPosition = {
        ...position,
        balanceShares: balance.toString(),
        balancePosition: BigNumber(previewRedeemValue.toString())
          .dividedBy(10 ** 18)
          .toString(),
      };

      setVaultPosition(updatedVaultPosition);
    } catch (error) {
      console.error("Error updating vault position:", error);
    }
  };

  useEffect(() => {
    if (account && vaultService) {
      loadPosition({
        variables: { account: account.toLowerCase(), vault: vaultId },
      }).then((res) => {
        if (
          res.data?.accountVaultPositions &&
          res.data?.accountVaultPositions.length
        ) {
          const position = res.data.accountVaultPositions[0];

          setVaultPosition(position);
          updateVaultPosition(position);
        } else {
          setVaultPosition({} as IVaultPosition);
        }
      });
    } else {
      setVaultPosition({} as IVaultPosition);
    }
  }, [
    account,
    vault,
    loadPosition,
    setVaultPosition,
    poolService,
    vaultService,
  ]);

  useEffect(() => {
    try {
      const methods = (VAULT_ABI as FunctionFragment[]).filter(
        (item: FunctionFragment) => item.type === "function"
      );

      setVaultMethods(methods);
    } catch (e: any) {
      console.error(e);
    }
  }, [setVaultMethods]);

  useEffect(() => {
    try {
      const methods = (STRATEGY_ABI as FunctionFragment[]).filter(
        (item: FunctionFragment) => item.type === "function"
      );

      setStrategyMethods(methods);
    } catch (e: any) {
      console.error(e);
    }
  }, [setStrategyMethods]);

  const fetchBalanceToken = useCallback(
    (
      fetchBalanceTokenType: FetchBalanceTokenType = FetchBalanceTokenType.FETCH
    ) => {
      if (vault === null) {
        return;
      }

      if (fetchBalanceTokenType === FetchBalanceTokenType.PROMISE) {
        return vaultService
          .previewRedeem(
            BigNumber(vaultPosition?.balanceShares as string)
              .dividedBy(10 ** 18)
              .toString(),
            vault.id
          )
          .catch((error) => {
            showErrorNotification(error);
            return "-1";
          });
      }
      return vaultService
        .previewRedeem(
          BigNumber(vaultPosition?.balanceShares as string)
            .dividedBy(10 ** 18)
            .toString(),
          vault.id
        )
        .then((balanceToken: string) => {
          setBalanceToken(balanceToken);
        })
        .catch((error) => {
          setBalanceToken("-1");
          showErrorNotification(error);
        });
    },
    [vaultService, vault, vaultPosition, setBalanceToken]
  );

  const fetchPositionTransactions = useCallback(
    (fetchType: TransactionFetchType = TransactionFetchType.FETCH) => {
      if (vault === null) {
        return;
      }
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return refetchTransactions({
            variables: { account: account.toLowerCase() },
          });
        }

        setTransactionLoading(true);

        return loadPositionTransactions({
          variables: {
            account: account.toLowerCase(),
            vault: vault.id,
          },
        })
          .then((res) => {
            res.data?.deposits && setDepositsList(res.data.deposits);
            res.data?.withdrawals && setWithdrawalsList(res.data.withdrawals);
          })
          .finally(() => setTransactionLoading(false));
      } else {
        setDepositsList([]);
        setWithdrawalsList([]);
        return;
      }
    },
    [
      account,
      setDepositsList,
      setTransactionLoading,
      loadPositionTransactions,
      refetchTransactions,
    ]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (vaultPosition && vault) {
      fetchBalanceToken();
      fetchPositionTransactions();
      interval = setInterval(fetchBalanceToken, 15 * 1000);
    }
    return () => clearInterval(interval);
  }, [vault, fetchBalanceToken, fetchPositionTransactions]);

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
      setTransactionLoading(true);
      Promise.all([
        fetchPositionTransactions(TransactionFetchType.PROMISE),
        fetchBalanceToken(FetchBalanceTokenType.PROMISE),
      ])
        .then(([transactions, balanceToken]) => {
          setBalanceToken(balanceToken as string);
          transactions?.data?.deposits &&
            setDepositsList(transactions?.data.deposits);
          transactions?.data?.withdrawals &&
            setWithdrawalsList(transactions?.data.withdrawals);
        })
        .finally(() => setTransactionLoading(false));
    }
  }, [
    syncVault,
    prevSyncVault,
    fetchPositionTransactions,
    vaultPosition,
    vault,
    setBalanceToken,
    setDepositsList,
    setWithdrawalsList,
    setTransactionLoading,
  ]);

  const balanceEarned = useMemo(() => {
    if (balanceToken === "-1") return 0;

    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    return transactionsLoading
      ? -1
      : BigNumber(balanceToken || "0")
          .minus(sumTokenDeposits.minus(sumTokenWithdrawals))
          .dividedBy(10 ** 18)
          .toNumber();
  }, [
    vaultPosition,
    balanceToken,
    depositsList,
    withdrawalsList,
    transactionsLoading,
  ]);

  const executeHasRoleMethod = async (): Promise<boolean> => {
    if (vault === null) {
      return false;
    }
    try {
      const VAULT_ABI = SmartContractFactory.FathomVault("").abi;
      const vaultContract = new Contract(vault.id, VAULT_ABI, library);

      return await vaultContract.hasRole(DEFAULT_ADMIN_ROLE, account);
    } catch (error) {
      console.error(
        `Failed to execute hasRole method for vault ${vault.id}:`,
        error
      );
      return false;
    }
  };

  const executeManagementMethod = async (
    strategyId: string
  ): Promise<boolean> => {
    const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;
    try {
      const strategyContract = new Contract(strategyId, STRATEGY_ABI, library);

      const result = await strategyContract.management();
      return result.includes(account);
    } catch (error) {
      console.error(
        `Failed to execute management method for strategy ${strategyId}:`,
        error
      );
      return false;
    }
  };

  const getStrategiesIds = useMemo(() => {
    const strategyIdsPromises = (vault?.strategies || []).map(
      async (strategy: IVaultStrategy) => {
        const isUserAuthorized = await executeManagementMethod(strategy.id);
        return isUserAuthorized ? strategy.id : null;
      }
    );

    return Promise.all(strategyIdsPromises).then(
      (authorizedIds) => authorizedIds.filter((id) => id !== null) as string[]
    );
  }, [vault]);

  useEffect(() => {
    if (vault && account) {
      getStrategiesIds.then((authorizedIds) =>
        setManagedStrategiesIds(authorizedIds)
      );
    } else {
      setManagedStrategiesIds([]);
    }
  }, [vault, account, getStrategiesIds]);

  useEffect(() => {
    if (vault && account) {
      executeHasRoleMethod().then((isManager) => setIsUserManager(isManager));
    } else {
      setIsUserManager(false);
    }
  }, [vault, account]);

  return {
    vault,
    vaultLoading,
    vaultPosition,
    vaultPositionLoading,
    reports,
    historicalApr,
    balanceEarned,
    balanceToken,
    protocolFee,
    performanceFee,
    activeVaultInfoTab,
    vaultMethods,
    strategyMethods,
    setActiveVaultInfoTab,
    managedStrategiesIds,
    isUserManager,
  };
};

export default useVaultDetail;
