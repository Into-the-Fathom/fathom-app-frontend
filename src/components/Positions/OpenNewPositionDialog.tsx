import { FC, memo } from "react";
import {
  Box,
  CircularProgress,
  DialogContent,
  Divider,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import useOpenPositionContext from "context/openPosition";
import useConnector from "context/connector";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import OpenPositionInfo from "components/Positions/OpenPosition/OpenPositionInfo";
import OpenPositionForm from "components/Positions/OpenPosition/OpenPositionForm";
import { BaseDialogWrapper } from "components/Base/Dialog/StyledDialog";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import { InfoIcon } from "components/Governance/Propose";
import {
  BaseErrorBox,
  BaseErrorMessage,
  BaseInfoBox,
  BaseWarningBox,
} from "components/Base/Boxes/StyledBoxes";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";

export const DividerMobile = styled(Divider)`
  width: 100%;
  height: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const DividerDefault = styled(Divider)`
  margin: 10px 0 0 0;
`;

const OpenNewPositionDialog: FC = () => {
  const {
    openPositionLoading,
    balance,
    approve,
    approvalPending,
    approveBtn,
    onClose,
    errors,
    proxyWalletExists,
    dangerSafetyBuffer,
    handleSubmit,
    onSubmit,
  } = useOpenPositionContext();

  const { isOpenPositionWhitelisted, account } = useConnector();

  return (
    <BaseDialogWrapper onClose={onClose} maxWidth="sm" open={true} fullWidth>
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Open Position
      </AppDialogTitle>
      <DialogContent>
        <OpenPositionForm />
        <OpenPositionInfo />

        {!isOpenPositionWhitelisted && (
          <BaseWarningBox>
            <InfoIcon />
            <Typography>
              Your wallet address is not whitelisted for open position.
              <br />
              <a
                href={
                  "https://docs.google.com/forms/d/e/1FAIpQLSdyQkwpYPAAUc5llJxk09ymMdjSSSjjiY3spwvRvCwfV08h2A/viewform"
                }
                target={"_blank"}
                rel="noreferrer"
              >
                Apply for being added to the whitelist to borrow FXD.
              </a>
            </Typography>
          </BaseWarningBox>
        )}
        {!proxyWalletExists && (
          <BaseWarningBox>
            <InfoIcon />
            <Typography>
              Your wallet address has no proxy wallet. <br />
              First transaction will be creation of proxy wallet.
            </Typography>
          </BaseWarningBox>
        )}
        {dangerSafetyBuffer ? (
          <BaseErrorBox>
            <InfoIcon
              sx={{ width: "16px", color: "#F5953D", height: "16px" }}
            />
            <BaseErrorMessage>
              Safety Buffer is moved into the danger zone. We recommend
              borrowing a lesser amount of FXD. Otherwise, your position may be
              at risk of liquidation if the price of collateral will drop.
            </BaseErrorMessage>
          </BaseErrorBox>
        ) : null}
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
            <ButtonPrimary
              onClick={approve}
              disabled={!!Object.keys(errors).length || approvalPending}
            >
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
                openPositionLoading ||
                approveBtn ||
                !!Object.keys(errors).length ||
                !isOpenPositionWhitelisted
              }
              isLoading={openPositionLoading}
            >
              {openPositionLoading ? (
                <CircularProgress sx={{ color: "#0D1526" }} size={20} />
              ) : (
                "Open this position"
              )}
            </ButtonPrimary>
          )}
        </ModalButtonWrapper>
      </DialogContent>
    </BaseDialogWrapper>
  );
};

export default memo(OpenNewPositionDialog);
