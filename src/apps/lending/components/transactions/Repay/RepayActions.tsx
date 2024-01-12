import {
  InterestRate,
  ProtocolAction,
} from "@into-the-fathom/lending-contract-helpers";
import { BoxProps } from "@mui/material";
import { useTransactionHandler } from "apps/lending/helpers/useTransactionHandler";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useRootStore } from "apps/lending/store/root";

import { TxActionsWrapper } from "apps/lending/components/transactions/TxActionsWrapper";
import { FC } from "react";

export interface RepayActionProps extends BoxProps {
  amountToRepay: string;
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  customGasPrice?: string;
  poolAddress: string;
  symbol: string;
  debtType: InterestRate;
  repayWithATokens: boolean;
  blocked?: boolean;
}

export const RepayActions: FC<RepayActionProps> = ({
  amountToRepay,
  poolReserve,
  poolAddress,
  isWrongNetwork,
  sx,
  symbol,
  debtType,
  repayWithATokens,
  blocked,
  ...props
}) => {
  const { repay, repayWithPermit, tryPermit } = useRootStore();

  const usingPermit = tryPermit({
    reserveAddress: poolAddress,
    isWrappedBaseAsset: poolReserve.isWrappedBaseAsset,
  });
  const {
    approval,
    action,
    requiresApproval,
    loadingTxns,
    approvalTxState,
    mainTxState,
  } = useTransactionHandler({
    tryPermit: usingPermit,
    permitAction: ProtocolAction.repayWithPermit,
    protocolAction: ProtocolAction.repay,
    eventTxInfo: {
      amount: amountToRepay,
      assetName: poolReserve.name,
      asset: poolReserve.underlyingAsset,
    },
    handleGetTxns: async () => {
      return repay({
        amountToRepay,
        poolAddress,
        repayWithATokens,
        debtType,
        poolReserve,
        isWrongNetwork,
        symbol,
      });
    },
    handleGetPermitTxns: async (signatures, deadline) => {
      return repayWithPermit({
        amountToRepay,
        poolReserve,
        isWrongNetwork,
        poolAddress,
        symbol,
        debtType,
        repayWithATokens,
        signature: signatures[0],
        deadline,
      });
    },
    skip: !amountToRepay || parseFloat(amountToRepay) === 0 || blocked,
    deps: [amountToRepay, poolAddress, repayWithATokens],
  });

  return (
    <TxActionsWrapper
      blocked={blocked}
      preparingTransactions={loadingTxns}
      symbol={poolReserve.symbol}
      mainTxState={mainTxState}
      approvalTxState={approvalTxState}
      requiresAmount
      amount={amountToRepay}
      requiresApproval={requiresApproval}
      isWrongNetwork={isWrongNetwork}
      sx={sx}
      {...props}
      handleAction={action}
      handleApproval={() =>
        approval([{ amount: amountToRepay, underlyingAsset: poolAddress }])
      }
      actionText={<>Repay {symbol}</>}
      actionInProgressText={<>Repaying {symbol}</>}
      tryPermit={usingPermit}
    />
  );
};
