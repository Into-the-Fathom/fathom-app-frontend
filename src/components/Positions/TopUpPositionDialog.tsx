import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";

import useTopUpPositionContext from "context/topUpPosition";
import useConnector from "context/connector";
import { DANGER_SAFETY_BUFFER } from "utils/Constants";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";
import TopUpPositionInfo from "components/Positions/TopUpPosition/TopUpPositionInfo";
import TopUpPositionForm from "components/Positions/TopUpPosition/TopUpPositionForm";
import { BaseDialogWrapper } from "components/Base/Dialog/StyledDialog";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import {
  BaseErrorBox,
  BaseInfoBox,
  BaseWarningBox,
} from "components/Base/Boxes/StyledBoxes";

const TopUpPositionDialog: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setTopUpPosition,
  setClosePosition,
}) => {
  const {
    collateral,
    safetyBuffer,
    onClose,
    approvalPending,
    openPositionLoading,
    approve,
    approveBtn,
    errorAtLeastOneField,
    balance,
    handleSubmit,
    onSubmit,
  } = useTopUpPositionContext();
  const { account } = useConnector();

  return (
    <BaseDialogWrapper onClose={onClose} maxWidth="sm" open={true} fullWidth>
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Top Up Position
      </AppDialogTitle>
      <DialogContent>
        <TopUpPositionForm
          topUpPosition={topUpPosition}
          closePosition={closePosition}
          setTopUpPosition={setTopUpPosition}
          setClosePosition={setClosePosition}
        />
        <TopUpPositionInfo />

        {BigNumber(safetyBuffer).isLessThan(DANGER_SAFETY_BUFFER) && (
          <BaseWarningBox>
            <InfoIcon />
            <Typography>
              Resulting in lowering safety buffer - consider provide more
              collateral or borrow less FXD.
            </Typography>
          </BaseWarningBox>
        )}
        {BigNumber(collateral).isLessThanOrEqualTo(0) && (
          <BaseWarningBox>
            <InfoIcon />
            <Typography>
              Providing 0 collateral you are making your position unsafer.
            </Typography>
          </BaseWarningBox>
        )}
        {errorAtLeastOneField && (
          <BaseErrorBox>
            <InfoIcon />
            <Typography>Please fill at least one field</Typography>
          </BaseErrorBox>
        )}
        {approveBtn && !!balance && (
          <BaseInfoBox>
            <InfoIcon />
            <Box flexDirection="column">
              <Typography width="100%">
                First-time connect? Please allow token approval in your MetaMask
              </Typography>
            </Box>
          </BaseInfoBox>
        )}
        <ModalButtonWrapper>
          <ButtonSecondary
            onClick={onClose}
            disabled={approvalPending || openPositionLoading}
          >
            Close
          </ButtonSecondary>
          {!account ? (
            <WalletConnectBtn />
          ) : approveBtn && balance !== "0" ? (
            <ButtonPrimary onClick={approve} disabled={approvalPending}>
              {" "}
              {approvalPending ? (
                <CircularProgress size={20} sx={{ color: "#0D1526" }} />
              ) : (
                "Approve token"
              )}{" "}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={
                approveBtn || openPositionLoading || errorAtLeastOneField
              }
              isLoading={openPositionLoading}
            >
              {openPositionLoading ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Top Up this position"
              )}
            </ButtonPrimary>
          )}
        </ModalButtonWrapper>
      </DialogContent>
    </BaseDialogWrapper>
  );
};

export default memo(TopUpPositionDialog);
