import { useStores } from "stores";
import { useCallback, useEffect, useMemo, useState } from "react";
import useMetaMask from "hooks/metamask";
import { Constants } from "helpers/Constants";
import { ClosePositionProps } from "components/Positions/ClosePositionDialog";

export enum ClosingType {
  Full,
  Partial,
}

const useClosePosition = (
  position: ClosePositionProps["position"],
  onClose: ClosePositionProps["onClose"]
) => {
  const { positionStore, poolStore } = useStores();
  const [collateral, setCollateral] = useState(0);
  const [fathomToken, setFathomToken] = useState(0);
  const [price, setPrice] = useState(0);
  const [closingType, setType] = useState(ClosingType.Full);

  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState(false);
  const [disableClosePosition, setDisableClosePosition] = useState(false);

  const { account } = useMetaMask()!;

  const pool = useMemo(
    () => poolStore.getPool(position.pool),
    [position.pool, poolStore]
  );

  const lockedCollateral = useMemo(
    () => position.lockedCollateral.div(Constants.WeiPerWad).toNumber(),
    [position]
  );

  const getBalance = useCallback(async () => {
    const balance = (await positionStore.balanceStableCoin(account)) || 0;
    setBalance(balance!);
  }, [positionStore, account, setBalance]);

  const handleOnOpen = useCallback(async () => {
    const priceWithSafetyMargin = await poolStore.getPriceWithSafetyMargin(
      pool
    );

    setType(ClosingType.Full);
    setPrice(priceWithSafetyMargin);
    setFathomToken(priceWithSafetyMargin * lockedCollateral);
    setCollateral(lockedCollateral);
  }, [
    pool,
    poolStore,
    lockedCollateral,
    setType,
    setPrice,
    setFathomToken,
    setCollateral,
  ]);

  useEffect(() => {
    getBalance();
    handleOnOpen();
  }, [getBalance, handleOnOpen]);

  useEffect(() => {
    balance / 10 ** 18 < fathomToken
      ? setBalanceError(true)
      : setBalanceError(false);
  }, [fathomToken, balance]);

  const closePosition = useCallback(async () => {
    setDisableClosePosition(true);
    try {
      await positionStore.partiallyClosePosition(
        position,
        pool,
        account,
        fathomToken,
        collateral
      );
      onClose();
    } catch (e) {}
    setDisableClosePosition(true);
  }, [
    position,
    pool,
    account,
    fathomToken,
    collateral,
    positionStore,
    onClose,
    setDisableClosePosition,
  ]);

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      const maxAllowed = lockedCollateral * price;
      let { value } = e.target;
      value = Number(value);

      value = value > maxAllowed ? maxAllowed : value;

      if (isNaN(value)) {
        return;
      }

      const walletBalance = Number(balance) / 10 ** 18;

      if (value > walletBalance) {
        setBalanceError(true);
      } else {
        setBalanceError(false);
      }

      setFathomToken(value);
      setCollateral(value / price);
    },
    [
      price,
      lockedCollateral,
      balance,
      setFathomToken,
      setCollateral,
      setBalanceError,
    ]
  );

  const handleTypeChange = useCallback(
    (type: ClosingType) => {
      if (type === ClosingType.Full) {
        setFathomToken(lockedCollateral * price);
        setCollateral(lockedCollateral);
      }
      setType(type);
    },
    [price, lockedCollateral, setFathomToken, setType, setCollateral]
  );

  const setMax = useCallback(() => {
    const walletBalance = balance / 10 ** 18;
    const maxBalance = lockedCollateral * price;

    const setBalance = walletBalance < maxBalance ? walletBalance : maxBalance;

    setFathomToken(setBalance);
    setCollateral(setBalance / price);
  }, [price, lockedCollateral, balance, setFathomToken, setCollateral]);

  return {
    collateral,
    lockedCollateral,
    price,
    fathomToken,
    pool,
    closingType,
    balance,
    balanceError,
    closePosition,
    disableClosePosition,
    handleFathomTokenTextFieldChange,
    handleTypeChange,
    setMax,
  };
};

export default useClosePosition;
