import { createContext, FC, ReactElement, useContext } from "react";
import useOpenPosition, { defaultValues } from "hooks/useOpenPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import {
  Control,
  FieldErrorsImpl,
  UseFormHandleSubmit
} from "react-hook-form";

export type OpenPositionContextType = {
  children: ReactElement;
  pool: ICollateralPool;
  onClose: () => void;
};

export type UseOpenPositionContextReturnType = {
  isMobile: boolean
  safeMax: number
  approveBtn: boolean,
  approve: () => void,
  approvalPending: boolean,
  collateralToBeLocked: number,
  collateralAvailableToWithdraw: number,
  fxdAvailableToBorrow: number,
  debtRatio: number,
  overCollateral: number,
  fxdToBeBorrowed: number,
  balance: number,
  safetyBuffer: number,
  liquidationPrice: number,
  collateral: string,
  fathomToken: string,
  openPositionLoading: boolean,
  setMax: (balance: number) => void,
  setSafeMax: () => void,
  onSubmit: (values: Record<string, any>) => void,
  control: Control<typeof defaultValues>,
  handleSubmit: UseFormHandleSubmit<typeof defaultValues> ,
  availableFathomInPool: number,
  pool: ICollateralPool,
  onClose: () => void,
  dangerSafetyBuffer: boolean,
  errors: Partial<FieldErrorsImpl<typeof defaultValues>>,
  maxBorrowAmount: string
};

// @ts-ignore
export const OpenPositionContext = createContext<UseOpenPositionContextReturnType>(
  {} as UseOpenPositionContextReturnType
);

export const OpenPositionProvider: FC<OpenPositionContextType> = ({ children, pool, onClose }) => {
  const values = useOpenPosition(pool, onClose);

  return (
    <OpenPositionContext.Provider value={values}>{children}</OpenPositionContext.Provider>
  );
};

const useOpenPositionContext = () => {
  const context = useContext(OpenPositionContext);

  if (!context) {
    throw new Error(
      "useOpenPositionContext hook must be used with a OpenPositionContext component"
    );
  }

  return context;
};

export default useOpenPositionContext;
