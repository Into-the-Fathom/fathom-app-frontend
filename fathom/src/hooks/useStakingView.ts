import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import useMetaMask from "context/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import { useStores } from "stores";
import ILockPosition from "stores/interfaces/ILockPosition";
import { useLazyQuery, useQuery } from "@apollo/client";
import { STAKING_PROTOCOL_STATS, STAKING_STAKER } from "apollo/queries";
import { Constants } from "helpers/Constants";
import useSyncContext from "context/sync";

export type ActionType = { type: string; id: number | null };

export enum DialogActions {
  NONE,
  UNCLAIMED,
  CLAIM_REWARDS,
  CLAIM_REWARDS_COOLDOWN,
  EARLY_UNSTAKE,
  UNSTAKE,
  UNSTAKE_COOLDOWN,
  WITHDRAW,
}

const useStakingView = () => {
  const [action, setAction] = useState<ActionType>();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const { stakingStore } = useStores();

  const [unstake, setUnstake] = useState<null | ILockPosition>(null);
  const [earlyUnstake, setEarlyUnstake] = useState<null | ILockPosition>(null);
  const [lockPositions, setLockPositions] = useState<ILockPosition[]>([]);

  const [totalRewards, setTotalRewards] = useState(0);;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { setLastTransactionBlock, syncDao, prevSyncDao } = useSyncContext();

  const [dialogAction, setDialogAction] = useState<DialogActions>(
    DialogActions.NONE
  );

  const {
    data: protocolStatsInfo,
    loading: protocolStatsLoading,
    refetch: refetchProtocolStats,
  } = useQuery(STAKING_PROTOCOL_STATS, {
    context: { clientName: "governance" },
  });

  const [
    fetchStakers,
    {
      data: stakersData,
      loading: stakersLoading,
      refetch: refetchStakers,
      fetchMore: fetchMoreStakers,
    },
  ] = useLazyQuery(STAKING_STAKER, {
    context: { clientName: "governance" },
  });

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetchStakers({
        variables: {
          skip: 0,
          first: Constants.COUNT_PER_PAGE,
          address: account,
        },
      });

      refetchProtocolStats();

      setCurrentPage(1);
    }
  }, [
    syncDao,
    account,
    prevSyncDao,
    refetchStakers,
    refetchProtocolStats,
    setCurrentPage,
  ]);

  useEffect(() => {
    if (account && stakersData?.stakers?.length) {
      stakingStore.getStreamClaimableAmount(account).then((amount) => {
        setTotalRewards(Number(amount))
      })
    }
  }, [
    account,
    stakingStore,
    stakersData,
    setTotalRewards,
  ])

  useEffect(() => {
    if (stakersData?.stakers?.length) {
      const promises: Promise<number>[] = [];
      stakersData?.stakers[0].lockPositions.forEach(
        (lockPosition: ILockPosition) => {
          promises.push(
            stakingStore.getStreamClaimableAmountPerLock(
              account,
              lockPosition.lockId
            )
          );
        }
      );

      Promise.all(promises)
        .then((result) => {
          const newLockPositions = stakersData?.stakers[0].lockPositions.map(
            (lockPosition: ILockPosition, index: number) => {
              const newLockPosition: ILockPosition = { ...lockPosition };
              newLockPosition.rewardsAvailable = Number(result[index]);
              return newLockPosition;
            }
          );

          setLockPositions(newLockPositions);
        })

    } else {
      setLockPositions([]);
    }
  }, [
    stakingStore,
    stakersData,
    account,
    setLockPositions,
  ]);

  const processFlow = useCallback(
    (action: string, position?: ILockPosition) => {
      action === "early" && setEarlyUnstake(position!);
      action === "unstake" && setUnstake(position!);

      ["early", "unstake"].includes(action) &&
        position!.rewardsAvailable > 0 &&
        setDialogAction(DialogActions.UNCLAIMED);

      if (action === "skip" || action === "continue") {
        !!unstake && setDialogAction(DialogActions.UNSTAKE);
        !!earlyUnstake && setDialogAction(DialogActions.EARLY_UNSTAKE);
      }

      action === "unstake-cooldown" &&
        setDialogAction(DialogActions.UNSTAKE_COOLDOWN);

      action === "claim-cooldown" &&
        setDialogAction(DialogActions.CLAIM_REWARDS_COOLDOWN);

      action === "claim" && setDialogAction(DialogActions.CLAIM_REWARDS);

      action === "withdraw" && setDialogAction(DialogActions.WITHDRAW);
    },
    [unstake, earlyUnstake, setEarlyUnstake, setUnstake, setDialogAction]
  );

  useEffect(() => {
    if (account) {
      fetchStakers({
        variables: {
          skip: 0,
          first: Constants.COUNT_PER_PAGE,
          address: account,
        },
      });
    }
  }, [account, fetchStakers]);

  const claimRewards = useCallback(
    async (callback: Function) => {
      setAction({ type: "claim", id: null });
      try {
        const receipt = await stakingStore.handleClaimRewards(account);
        setLastTransactionBlock(receipt.blockNumber);
        callback();
      } catch (e) {
        logger.log(LogLevel.error, "Claim error");
      }
      setAction(undefined);
    },
    [stakingStore, account, logger, setAction, setLastTransactionBlock]
  );

  const withdrawAll = useCallback(async () => {
    setAction({ type: "withdrawAll", id: null });
    try {
      const receipt = await stakingStore.handleWithdrawAll(account);
      setLastTransactionBlock(receipt.blockNumber);
    } catch (e) {
      logger.log(LogLevel.error, "Withdraw error");
    }
    setAction(undefined);
  }, [stakingStore, account, logger, setAction, setLastTransactionBlock]);

  const handleEarlyUnstake = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      try {
        const receipt = await stakingStore.handleEarlyWithdrawal(
          account,
          lockId
        );
        setLastTransactionBlock(receipt.blockNumber);
      } catch (e) {
        logger.log(LogLevel.error, "Handle early withdrawal");
      }
      setAction(undefined);
    },
    [stakingStore, account, logger, setAction, setLastTransactionBlock]
  );

  const handleUnlock = useCallback(
    async (lockId: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      try {
        const receipt = await stakingStore.handleUnlock(account, lockId);
        setLastTransactionBlock(receipt.blockNumber);
      } catch (e: any) {}

      setAction(undefined);
    },
    [stakingStore, account, setAction, setLastTransactionBlock]
  );

  const isUnlockable = useCallback((remainingTime: number) => {
    return remainingTime <= 0;
  }, []);

  const onClose = useCallback(() => {
    setEarlyUnstake(null);
    setUnstake(null);
    setDialogAction(DialogActions.NONE);
  }, [setEarlyUnstake, setUnstake, setDialogAction]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMoreStakers({
        variables: {
          address: account,
          first: Constants.COUNT_PER_PAGE,
          skip: (page - 1) * Constants.COUNT_PER_PAGE,
        },
      });
      setCurrentPage(page);
    },
    [setCurrentPage, fetchMoreStakers, account]
  );

  return {
    account,
    chainId,
    action,
    isLoading: stakersLoading,
    isUnlockable,
    withdrawAll,
    claimRewards,

    handleEarlyUnstake,
    handleUnlock,

    unstake,
    earlyUnstake,

    dialogAction,
    setDialogAction,
    totalRewards,

    setUnstake,
    setEarlyUnstake,

    onClose,
    processFlow,

    staker:
      !stakersLoading && stakersData?.stakers?.length
        ? stakersData.stakers[0]
        : null,
    lockPositions,
    protocolStatsInfo:
      !protocolStatsLoading && protocolStatsInfo.protocolStats.length
        ? protocolStatsInfo.protocolStats[0]
        : null,

    itemCount: stakersData?.stakers?.length
      ? stakersData.stakers[0].lockPositionCount
      : 0,
    currentPage,
    handlePageChange,
  } as const;
};

export default useStakingView;
