import {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  Dispatch,
  useMemo,
} from "react";

import { useServices } from "context/services";
import { IOpenPosition, ICollateralPool } from "fathom-sdk";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS } from "apollo/queries";

import { COUNT_PER_PAGE } from "utils/Constants";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";

const useOpenPositionList = (
  setPositionCurrentPage: Dispatch<number>,
  proxyWallet: string
) => {
  const { positionService } = useServices();
  const { chainId, account } = useConnector();
  const [formattedPositions, setFormattedPositions] = useState<IOpenPosition[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loadPositions, { loading, data, fetchMore, called }] = useLazyQuery(
    FXD_POSITIONS,
    {
      context: { clientName: "stable" },
    }
  );

  const { data: poolsData } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const [closePosition, setClosePosition] = useState<IOpenPosition>();
  const [topUpPosition, setTopUpPosition] = useState<IOpenPosition>();

  const topUpPositionPool = useMemo(() => {
    if (topUpPosition && poolsData) {
      return poolsData.pools.find(
        (pool: ICollateralPool) => pool.id === topUpPosition.collateralPool
      );
    }

    return null;
  }, [topUpPosition, poolsData]);

  useEffect(() => {
    if (proxyWallet && account) {
      loadPositions({
        variables: {
          first: COUNT_PER_PAGE,
          skip: 0,
          walletAddress: proxyWallet,
        },
        fetchPolicy: "network-only",
      });
    } else {
      setFormattedPositions([]);
    }
  }, [chainId, proxyWallet, account, called, loadPositions]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      setIsLoading(true);
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
          walletAddress: proxyWallet,
        },
      }).then(
        ({ data: { positions } }) => !positions.length && setIsLoading(false)
      );
      setPositionCurrentPage(page);
    },
    [proxyWallet, setPositionCurrentPage, setIsLoading, fetchMore]
  );

  const fetchPositions = useMemo(
    () =>
      debounce((data, poolsData) => {
        setIsLoading(true);
        const filteredPosition = data.positions.filter(
          (position: IOpenPosition) => position.positionStatus !== "closed"
        );

        const promises = filteredPosition.map((position: IOpenPosition) =>
          positionService.getDebtValue(
            position.debtShare,
            position.collateralPool
          )
        );

        Promise.all(promises).then((debtValues) => {
          const positions = filteredPosition.map(
            (position: IOpenPosition, index: number) => {
              const findPool = poolsData.pools.find(
                (pool: ICollateralPool) => pool.id === position.collateralPool
              );

              const debtValue = debtValues[index];

              const liquidationPrice = BigNumber(position.debtValue)
                .dividedBy(position.lockedCollateral)
                .multipliedBy(findPool.liquidationRatio)
                .toNumber();

              const ltv = BigNumber(position.debtValue)
                .dividedBy(
                  BigNumber(findPool.rawPrice).multipliedBy(
                    position.lockedCollateral
                  )
                )
                .toNumber();

              return {
                ...position,
                debtValue,
                liquidationPrice,
                ltv,
              };
            }
          );

          setFormattedPositions(positions);
          setIsLoading(false);
        });
      }, 300),
    [positionService, setFormattedPositions, setIsLoading]
  );

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (loading || !data || !poolsData) {
      return setFormattedPositions([]);
    }

    fetchPositions(data, poolsData);
  }, [loading, data, poolsData, fetchPositions]);

  const onClose = useCallback(() => {
    setClosePosition(undefined);
    setTopUpPosition(undefined);
  }, [setClosePosition, setTopUpPosition]);

  return {
    topUpPositionPool,
    positions: formattedPositions,
    closePosition,
    topUpPosition,
    loading: isLoading,
    handlePageChange,
    setTopUpPosition,
    setClosePosition,
    onClose,
  };
};

export default useOpenPositionList;
