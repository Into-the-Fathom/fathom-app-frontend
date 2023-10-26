import { createContext, FC, ReactElement, useContext } from "react";
import useOpenPosition from "hooks/useOpenPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";

export type OpenPositionContextType = {
  children: ReactElement;
  pool: ICollateralPool;
  onClose: () => void;
};

export type UseOpenPositionContextReturnType = {}

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
