import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@apollo/client";
import { HEALTH } from "../apollo/queries";

type StakingProviderType = {
  children: ReactElement;
};

type UseSyncContextReturn = {
  setLastTransactionBlock: Dispatch<number>;
  syncFXD: boolean;
  prevSyncFxd: boolean;
  syncDao: boolean;
  prevSyncDao: boolean;
};

export const SyncContext = createContext<UseSyncContextReturn | undefined>(
  undefined
);

export const SyncProvider: FC<StakingProviderType> = ({ children }) => {
  const [lastTransactionBlock, setLastTransactionBlock] = useState<number>();
  const [syncFXD, setSyncFXD] = useState<boolean>(true);
  const [syncDao, setSyncDao] = useState<boolean>(true);

  const prevSyncFxd = useRef<boolean>(true);
  const prevSyncDao = useRef<boolean>(true);

  const { data: fxdData, refetch: refetchFxd } = useQuery(HEALTH, {
    variables: {
      name: "fathomapp-subgraph",
    },
  });

  const { data: daoData, refetch: refetchDao } = useQuery(HEALTH, {
    variables: {
      name: "dao-subgraph",
    }
  })

  const values = useMemo(() => {
    return {
      syncFXD,
      syncDao,
      setLastTransactionBlock,
      prevSyncFxd: prevSyncFxd.current,
      prevSyncDao: prevSyncDao.current,
    };
  }, [setLastTransactionBlock, syncFXD, syncDao]);

  useEffect(() => {
    prevSyncFxd.current = syncFXD;
  }, [syncFXD]);

  useEffect(() => {
    prevSyncDao.current = syncDao;
  }, [syncDao]);

  useEffect(() => {
    if (
      !lastTransactionBlock &&
      fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
    ) {
      setSyncFXD(true);
      return setLastTransactionBlock(
        Number(
          fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
      );
    }

    if (
      Number(lastTransactionBlock) >
      Number(
        fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
      )
    ) {
      setTimeout(() => {
        refetchFxd();
      }, 500);

      setSyncFXD(false);
    } else {
      setSyncFXD(true);
    }
  }, [
    lastTransactionBlock,
    fxdData,
    setLastTransactionBlock,
    refetchFxd,
    setSyncFXD,
  ]);

  useEffect(() => {
    if (
      !lastTransactionBlock &&
      daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
    ) {
      setSyncDao(true);
      return setLastTransactionBlock(
        Number(
          daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
      );
    }

    if (
      Number(lastTransactionBlock) >
      Number(
        daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
      )
    ) {
      setTimeout(() => {
        refetchDao();
      }, 400);

      setSyncDao(false);
    } else {
      setSyncDao(true);
    }
  }, [
    lastTransactionBlock,
    daoData,
    setLastTransactionBlock,
    refetchDao,
    setSyncDao,
  ]);

  return (
    // @ts-ignore
    <SyncContext.Provider value={values}>{children}</SyncContext.Provider>
  );
};

const useSyncContext = (): UseSyncContextReturn => {
  const context = useContext(SyncContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
};

export default useSyncContext;
