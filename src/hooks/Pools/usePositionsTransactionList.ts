import { useCallback, useEffect, useMemo, useState } from "react";
import useConnector from "context/connector";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_ACTIVITIES, FXD_POOLS } from "apollo/queries";
import { SelectChangeEvent } from "@mui/material";
import { ICollateralPool, IOpenPosition } from "fathom-sdk";
import useDashboard from "context/fxd";
import {
  filterCollateralName,
  filterPoolCollateralAddress,
  filterPoolSymbol,
  filterTransaction,
} from "../../utils/fxdActivitiesFilters";
import { useServices } from "context/services";

export enum PositionActivityState {
  CREATED = "created",
  TOP_UP = "topup",
  REPAY = "repay",
  LIQUIDATION = "liquidation",
  CLOSED = "closed",
}

export interface IFxdTransaction {
  id: string;
  position: IOpenPosition;
  activityState: PositionActivityState;
  collateralAmount: string;
  debtAmount: string;
  blockNumber: number;
  blockTimestamp: number;
  transaction: string;
}

export enum FilterTxType {
  all = "All",
  created = "Position created",
  topup = "Position top up",
  repay = "Position partial withdraw",
  closed = "Position close",
  liquidation = "Position liquidation",
}

export type FilterTxTypeKeys = keyof typeof FilterTxType;

const usePositionsTransactionList = () => {
  /**
   * Filter state
   */
  const [filterByType, setFilterByType] = useState<FilterTxTypeKeys>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [collateralTokenAddresses, setCollateralTokenAddresses] = useState<
    string[]
  >([]);
  /**
   * Activities
   */
  const [fxdActivities, setFxdActivities] = useState<IFxdTransaction[]>([]);

  const { account, chainId } = useConnector();
  const { proxyWallet } = useDashboard();
  const { poolService } = useServices();

  const [fetchActivities, { refetch: refetchActivities, loading }] =
    useLazyQuery(FXD_ACTIVITIES, {
      context: { clientName: "stable", chainId },
      variables: {
        first: 1000,
        chainId,
        orderBy: "blockNumber",
        orderDirection: "desc",
      },
    });

  const { data: pools } = useQuery(FXD_POOLS, {
    context: { clientName: "stable", chainId },
    variables: { chainId },
  });

  useEffect(() => {
    if (pools?.pools?.length) {
      const promises = pools?.pools.map((pool: ICollateralPool) =>
        poolService.getCollateralTokenAddress(pool.tokenAdapterAddress)
      );

      Promise.all(promises).then((addresses) => {
        setCollateralTokenAddresses(addresses);
      });
    } else {
      setCollateralTokenAddresses([]);
    }
  }, [pools, poolService, setCollateralTokenAddresses]);

  useEffect(() => {
    if (account && proxyWallet && chainId) {
      const variables: {
        proxyWallet: string;
        activityState?: string[];
        first?: number;
      } = {
        proxyWallet,
      };

      if (filterByType === Object.keys(FilterTxType)[0]) {
        variables["activityState"] = Object.values(PositionActivityState);
        variables["first"] = 1000;
      } else {
        variables["activityState"] = [filterByType];
        variables["first"] = 1000;
      }

      fetchActivities({
        variables,
      }).then(({ data }) => {
        setFxdActivities(data?.positionActivities || []);
      });
    } else {
      setFxdActivities([]);
    }
  }, [account, proxyWallet, setFxdActivities, chainId, filterByType]);

  const handleFilterByType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      setFilterByType(event.target.value as FilterTxTypeKeys);
    },
    [setFilterByType]
  );

  const filterActive = useMemo(() => {
    return filterByType !== "all" || searchValue !== "";
  }, [filterByType, searchValue]);

  const filteredActivities = useMemo(() => {
    if (
      searchValue &&
      pools?.pools?.length &&
      collateralTokenAddresses.length
    ) {
      return fxdActivities.filter((txActivity) => {
        const filterPoolCollateralAddressVal = filterPoolCollateralAddress(
          searchValue,
          collateralTokenAddresses
        );

        const filterPoolSymbolVal = filterPoolSymbol(
          searchValue,
          txActivity.position.collateralPoolName
        );

        const filterCollateralNameVal = filterCollateralName(
          searchValue,
          txActivity.position.collateralPoolName
        );

        const filterTransactionVal = filterTransaction(
          searchValue,
          txActivity.transaction
        );

        return (
          filterPoolCollateralAddressVal ||
          filterPoolSymbolVal ||
          filterCollateralNameVal ||
          filterTransactionVal
        );
      });
    }

    return fxdActivities;
  }, [searchValue, fxdActivities, pools, collateralTokenAddresses]);

  return {
    fxdActivities: filteredActivities,
    isLoading: loading,
    filterActive,
    filterByType,
    searchValue,
    handleFilterByType,
    refetchActivities,
    setFilterByType,
    setSearchValue,
  };
};

export default usePositionsTransactionList;