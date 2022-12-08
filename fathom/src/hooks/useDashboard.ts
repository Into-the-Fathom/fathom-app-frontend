import { useStores } from "stores";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS, FXD_STATS, FXD_USER } from "apollo/queries";
import useMetaMask from "context/metamask";
import { useCallback, useEffect, useState } from "react";
import { Constants } from "helpers/Constants";

const useDashboard = () => {
  const { positionStore } = useStores();
  const { account } = useMetaMask()!;

  const { refetch: refetchStats } = useQuery(FXD_STATS, {
    context: { clientName: "stable" },
  });
  const [, { refetch: refetchPositions }] = useLazyQuery(FXD_POSITIONS, {
    context: { clientName: "stable" },
  });
  const { refetch: refetchPools } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
  });

  const [positionCurrentPage, setPositionCurrentPage] = useState(1);
  const [positionsItemsCount, setPositionsItemsCount] = useState(0);
  const [proxyWallet, setProxyWallet] = useState("");

  const [loadUserStats, { refetch: refetchUserStats }] = useLazyQuery(
    FXD_USER,
    {
      context: { clientName: "stable" },
      fetchPolicy: "cache-first",
    }
  );

  const fetchUserStatsAndProxyWallet = useCallback(async () => {
    const proxyWallet = await positionStore.getProxyWallet(account);
    setProxyWallet(proxyWallet!);

    loadUserStats({
      variables: {
        walletAddress: proxyWallet,
      },
    }).then(({ data: { users } }) => {
      setPositionsItemsCount(users[0]?.activePositionsCount || 0);
    });
  }, [
    positionStore,
    account,
    loadUserStats,
    setPositionsItemsCount,
    setProxyWallet,
  ]);

  useEffect(() => {
    if (account) {
      fetchUserStatsAndProxyWallet();
    }
  }, [account, fetchUserStatsAndProxyWallet]);

  const refetchData = useCallback(async () => {
    setTimeout(() => {
      refetchStats();
      refetchPools();
      refetchPositions({
        walletAddress: proxyWallet,
        first: Constants.COUNT_PER_PAGE,
        skip: 0,
      }).then(() => {
        setPositionCurrentPage(1);
      });

      refetchUserStats({
        variables: {
          walletAddress: proxyWallet,
        },
      }).then(({ data: { users } }) => {
        const itemsCount = users[0].activePositionsCount;
        setPositionsItemsCount(itemsCount);
      });
    }, 1200);
  }, [
    proxyWallet,
    refetchStats,
    refetchPools,
    refetchPositions,
    refetchUserStats,
  ]);

  return {
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    refetchData,
    setPositionCurrentPage,
  };
};

export default useDashboard;
