import {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SmartContractFactory } from "fathom-sdk";
import { useServices } from "context/services";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import { BigNumber as eBigNumber } from "ethers";
import BigNumber from "bignumber.js";

type PricesProviderType = {
  children: ReactElement;
};

export type UsePricesContextReturn = {
  fxdPrice: string;
  wxdcPrice: string;
  fthmPrice: string;
};

export const PricesContext = createContext<UsePricesContextReturn>(
  {} as UsePricesContextReturn
);

export const PricesProvider: FC<PricesProviderType> = ({ children }) => {
  const { stakingService } = useServices();
  const { chainId } = useConnector();
  const { provider } = useServices();

  const [fxdPrice, setFxdPrice] = useState<string>("0");
  const [wxdcPrice, setWxdcPrice] = useState<string>("0");
  const [fthmPrice, setFthmPrice] = useState<string>("0");

  const { syncDao, prevSyncDao, syncFXD, prevSyncFxd } = useSyncContext();

  const fthmTokenAddress = useMemo(() => {
    return SmartContractFactory.FthmToken(chainId ? chainId : DEFAULT_CHAIN_ID)
      .address;
  }, [chainId]);

  const usdtTokenAddress = useMemo(() => {
    return SmartContractFactory.USDT(chainId ? chainId : DEFAULT_CHAIN_ID)
      .address;
  }, [chainId]);

  const fxdTokenAddress = useMemo(() => {
    return SmartContractFactory.FathomStableCoin(
      chainId ? chainId : DEFAULT_CHAIN_ID
    ).address;
  }, [chainId]);

  const wxdcTokenAddress = useMemo(() => {
    return SmartContractFactory.WXDC(chainId ? chainId : DEFAULT_CHAIN_ID)
      .address;
  }, [chainId]);

  const fetchPairPrices = useCallback(async () => {
    if (provider) {
      try {
        let fthmPromise;

        if (process.env.REACT_APP_ENV !== "prod") {
          fthmPromise = stakingService.getPairPrice(
            fxdTokenAddress,
            fthmTokenAddress
          );
        } else {
          fthmPromise = Promise.resolve([eBigNumber.from(0)]);
        }

        const xdcUsdtPromise =
          process.env.REACT_APP_ENV === "prod"
            ? stakingService.getPairPrice(wxdcTokenAddress, usdtTokenAddress)
            : stakingService.getPairPrice(usdtTokenAddress, wxdcTokenAddress);

        const xdcFxdPromise = stakingService.getPairPrice(
          fxdTokenAddress,
          wxdcTokenAddress
        );

        Promise.all([fthmPromise, xdcUsdtPromise, xdcFxdPromise])
          .then(([fthmPrice, xdcUsdtPrice, xdcFxdPrice]) => {
            if (process.env.REACT_APP_ENV !== "prod") {
              setFthmPrice(fthmPrice[0].toString());
            }

            const fxdPrice = BigNumber(xdcFxdPrice[1].toString())
              .dividedBy(xdcUsdtPrice[1].toString())
              .multipliedBy(10 ** 18)
              .toString();

            setWxdcPrice(xdcUsdtPrice[0].toString());
            setFxdPrice(fxdPrice);

            console.log({
              "fxd/fthm": fthmPrice[1].toString(),
              "fthm/fxd": fthmPrice[0].toString(),
              "fxd/usdt": fxdPrice,
              "wxdc/usdt": xdcUsdtPrice[0].toString(),
            });
          })
          .catch((e) => {
            console.log("Pairs not exists on DEX", e);
          });
      } catch (e: any) {
        console.log(e);
      }
    }
  }, [
    provider,
    stakingService,
    usdtTokenAddress,
    fthmTokenAddress,
    fxdTokenAddress,
    wxdcTokenAddress,
    setFxdPrice,
    setFthmPrice,
    setWxdcPrice,
  ]);

  useEffect(() => {
    fetchPairPrices();
  }, [fetchPairPrices]);

  useEffect(() => {
    if ((syncFXD && !prevSyncFxd) || (syncDao && !prevSyncDao)) {
      fetchPairPrices();
    }
  }, [syncFXD, prevSyncFxd, syncDao, prevSyncDao]);

  const values = useMemo(() => {
    return {
      fxdPrice,
      wxdcPrice,
      fthmPrice,
    };
  }, [fxdPrice, wxdcPrice, fthmPrice]);

  return (
    <PricesContext.Provider value={values}>{children}</PricesContext.Provider>
  );
};

const usePricesContext = () => {
  const context = useContext(PricesContext);

  if (!context) {
    throw new Error(
      "usePricesContext hook must be used with a PricesContext component"
    );
  }

  return context;
};

export default usePricesContext;
