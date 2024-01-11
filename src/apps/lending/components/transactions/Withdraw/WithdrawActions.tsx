import { ProtocolAction } from "@aave/contract-helpers";
import { Trans } from "@lingui/macro";
import { BoxProps } from "@mui/material";
import { useTransactionHandler } from "apps/lending/helpers/useTransactionHandler";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useRootStore } from "apps/lending/store/root";

import { TxActionsWrapper } from "apps/lending/components/transactions/TxActionsWrapper";

export interface WithdrawActionsProps extends BoxProps {
  poolReserve: ComputedReserveData;
  amountToWithdraw: string;
  poolAddress: string;
  isWrongNetwork: boolean;
  symbol: string;
  blocked: boolean;
}

export const WithdrawActions = ({
  poolReserve,
  amountToWithdraw,
  poolAddress,
  isWrongNetwork,
  symbol,
  blocked,
  sx,
}: WithdrawActionsProps) => {
  const withdraw = useRootStore((state) => state.withdraw);

  const {
    action,
    loadingTxns,
    mainTxState,
    approvalTxState,
    approval,
    requiresApproval,
  } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () =>
      withdraw({
        reserve: poolAddress,
        amount: amountToWithdraw,
        aTokenAddress: poolReserve.aTokenAddress,
      }),
    skip: !amountToWithdraw || parseFloat(amountToWithdraw) === 0 || blocked,
    deps: [amountToWithdraw, poolAddress],
    eventTxInfo: {
      amount: amountToWithdraw,
      assetName: poolReserve.name,
      asset: poolReserve.underlyingAsset,
    },
    protocolAction: ProtocolAction.withdraw,
  });

  return (
    <TxActionsWrapper
      blocked={blocked}
      preparingTransactions={loadingTxns}
      approvalTxState={approvalTxState}
      mainTxState={mainTxState}
      amount={amountToWithdraw}
      isWrongNetwork={isWrongNetwork}
      requiresAmount
      actionInProgressText={<Trans>Withdrawing {symbol}</Trans>}
      actionText={<Trans>Withdraw {symbol}</Trans>}
      handleAction={action}
      handleApproval={() =>
        approval([{ amount: amountToWithdraw, underlyingAsset: poolAddress }])
      }
      requiresApproval={requiresApproval}
      sx={sx}
    />
  );
};