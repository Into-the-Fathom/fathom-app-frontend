import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import React, { FC } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import { StakingViewItemLabel } from "components/Staking/StakingViewItem";
import { styled } from "@mui/material/styles";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import {
  InfoLabel,
  InfoValue,
  InfoWrapper,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ButtonPrimary,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useEarlyUnstake from "hooks/useEarlyUnstake";
import { InfoMessageWrapper } from "./ClaimRewardsDialog";

const UnstakeValue = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 7px;
  strong {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #9fadc6;
  }
`;

const UnstakeLabel = styled(StakingViewItemLabel)`
  padding-bottom: 7px;
  font-size: 11px;
`;

const UnstakeDialogWrapper = styled(AppDialog)`
  .MuiPaper-root {
    maxwidth: 600px;
  }
  .MuiGrid-container {
    margin: 0 17px 15px 17px;
    padding: 10px 0 30px 0;
  }
`;

const UnstakeBalanceWrapper = styled(Grid)`
  border-bottom: 1px solid #324567;
  width: auto;
`;

const UnstakeGrid = styled(Grid)`
  width: auto;
  &.MuiGrid-container {
    margin: 0 17px;
    padding: 10px 0;
  }
`;

const ConfirmButton = styled(ButtonPrimary)`
  width: 100%;
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
`;

const WarningBlock = styled(Box)`
  background: #452508;
  border: 1px solid #5C310A;
  border-radius: 8px;
  color: #F7B06E;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 12px;
  font-size: 14px;
`

const InfoLabelError = styled(InfoLabel)`
  color: #F76E6E;
`

const InfoValueError = styled(InfoValue)`
  color: #F76E6E;
`

type EarlyUnstakeDialogProps = {
  token: string;
  lockPosition: ILockPosition;
  onClose: () => void;
};

const EarlyUnstakeDialog: FC<EarlyUnstakeDialogProps> = ({
  onClose,
  token,
  lockPosition,
}) => {
  const {
    balanceError,
    unstakeAmount,
    totalBalance,
    isLoading,

    handleUnstakeAmountChange,
    formatNumber,
    setMax,
    earlyUnstakeHandler,
  } = useEarlyUnstake(lockPosition);

  return (
    <UnstakeDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Early Unstake
      </AppDialogTitle>

      <DialogContent>
        <UnstakeGrid container sx={{ '&.MuiGrid-container': { padding: '20px 0' } }}>
          <Grid item xs={12}>
            <WarningBlock>
              <InfoIcon sx={{ fontSize: "18px", color: '#F5953D' }} />
              <Typography component={'span'}>
                Penalty fee will be applied.
              </Typography>
            </WarningBlock>
          </Grid>
        </UnstakeGrid>
        <UnstakeBalanceWrapper container>
          <Grid item xs={8}>
            <UnstakeLabel>My staked balance</UnstakeLabel>
            <UnstakeValue>
              <strong>
                {" "}
                {lockPosition && formatNumber(lockPosition?.MAINTokenBalance)}
              </strong>
              { token }<span>$2,566.84</span>
            </UnstakeValue>
          </Grid>
          <Grid item xs={4}>
            <UnstakeLabel>Claimable rewards</UnstakeLabel>
            <UnstakeValue>
              <strong>
                {lockPosition &&
                  formatNumber(Number(lockPosition.RewardsAvailable))}
              </strong>
              { token }<span>$0.00</span>
            </UnstakeValue>
          </Grid>
        </UnstakeBalanceWrapper>

        <UnstakeGrid container>
          <Grid item xs={12}>
            <AppFormInputWrapper>
              <AppFormLabel>Unstake amount</AppFormLabel>
              {totalBalance ? (
                <WalletBalance>
                  Available: {formatNumber(totalBalance)} FTHM
                </WalletBalance>
              ) : null}
              <AppTextField
                error={balanceError}
                id="outlined-helperText"
                helperText={
                  balanceError ? (
                    <>
                      <InfoIcon sx={{ fontSize: "18px" }} />
                      <Typography
                        sx={{ fontSize: "12px", paddingLeft: "22px" }}
                      >
                        You do not have enough FTHM
                      </Typography>
                    </>
                  ) : null
                }
                value={unstakeAmount}
                onChange={handleUnstakeAmountChange}
              />
              <AppFormInputLogo src={getTokenLogoURL("FTHM")} />
              <MaxButton onClick={() => setMax()}>Max</MaxButton>
            </AppFormInputWrapper>
          </Grid>
        </UnstakeGrid>
        <UnstakeGrid
          container
          sx={{ "&.MuiGrid-container": { marginBottom: "20px" } }}
        >
          <Grid item xs={12}>
            <InfoWrapper>
              <InfoLabel>
                Total Available
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>{formatNumber(totalBalance)} FTHM</InfoValue>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabelError>
                Penalty Fee
              </InfoLabelError>
              <InfoValueError>6 FTHM (0.03%)</InfoValueError>
            </InfoWrapper>
            <InfoWrapper>
              <InfoLabel>
                Maximum Received
                <InfoIcon sx={{ fontSize: "18px", color: "#6379A1" }} />
              </InfoLabel>
              <InfoValue>{formatNumber(totalBalance)} FTHM</InfoValue>
            </InfoWrapper>
          </Grid>
        </UnstakeGrid>
        <InfoMessageWrapper>
          <InfoIcon sx={{ fontSize: "18px", color: "#4F658C" }} />
          <Typography>
            By clicking “Confirm Early Unstake”, you’ll be signing 2 transactions in
            MetaMask to withdraw this amount to your connected wallet, and to
            unlock the position.
          </Typography>
        </InfoMessageWrapper>
        <UnstakeGrid container>
          <Grid item xs={12}>
            <ConfirmButton
              disabled={isLoading}
              isLoading={isLoading}
              onClick={earlyUnstakeHandler}
            >
              {isLoading ? <CircularProgress size={30} /> : "Confirm Early Unstake"}
            </ConfirmButton>
          </Grid>
        </UnstakeGrid>
      </DialogContent>
    </UnstakeDialogWrapper>
  );
};

export default EarlyUnstakeDialog;
