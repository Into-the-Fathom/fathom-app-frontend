import { FC, memo } from "react";
import { FormProvider } from "react-hook-form";
import {
  Box,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BigNumber from "bignumber.js";

import { IVault } from "fathom-sdk";
import useVaultOpenDeposit from "hooks/Vaults/useVaultOpenDeposit";
import useConnector from "context/connector";

import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import DepositVaultInfo from "components/Vaults/VaultList/DepositVaultModal/DepositVaultInfo";
import DepositVaultForm from "components/Vaults/VaultList/DepositVaultModal/DepositVaultForm";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import {
  ErrorBox,
  InfoBoxV2,
  WarningBox,
} from "components/AppComponents/AppBox/AppBox";
import { InfoIcon } from "components/Governance/Propose";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import VaultModalLockingBar from "components/Vaults/VaultList/DepositVaultModal/VaultModalLockingBar";

const VaultManageGridDialogWrapper = styled(AppDialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    border: 1px solid #2c4066;
    background: #132340;

    & .MuiDialogContent-root {
      padding: 0 24px 24px;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiDialog-paper {
      height: fit-content;
    }
  }
`;

export type VaultDepositProps = {
  vaultItemData: IVault;
  performanceFee: number;
  isTfVaultType: boolean;
  isUserKycPassed: boolean;
  tfVaultDepositEndDate: string | null;
  tfVaultLockEndDate: string | null;
  activeTfPeriod: number;
  minimumDeposit: number;
  onClose: () => void;
};

const VaultListItemDepositModal: FC<VaultDepositProps> = ({
  vaultItemData,
  performanceFee,
  isTfVaultType,
  isUserKycPassed,
  tfVaultDepositEndDate,
  tfVaultLockEndDate,
  activeTfPeriod,
  minimumDeposit,
  onClose,
}) => {
  const {
    methods,
    walletBalance,
    isWalletFetching,
    control,
    deposit,
    sharedToken,
    approveBtn,
    approvalPending,
    openDepositLoading,
    errors,
    approve,
    setMax,
    validateMaxDepositValue,
    handleSubmit,
    onSubmit,
    depositLimitExceeded,
  } = useVaultOpenDeposit(vaultItemData, onClose);
  const { account } = useConnector();

  return (
    <VaultManageGridDialogWrapper
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
      data-testid="vault-listItemDepositModal"
    >
      <AppDialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        sx={{ padding: "24px !important" }}
        sxCloseIcon={{ right: "16px", top: "16px" }}
        data-testid="vault-listItemDepositModal-dialogTitle"
      >
        Deposit
      </AppDialogTitle>

      <DialogContent>
        {isTfVaultType && (
          <VaultModalLockingBar
            tfVaultLockEndDate={tfVaultLockEndDate}
            tfVaultDepositEndDate={tfVaultDepositEndDate}
            activeTfPeriod={activeTfPeriod}
          />
        )}
        <FormProvider {...methods}>
          <DepositVaultForm
            vaultItemData={vaultItemData}
            walletBalance={walletBalance}
            control={control}
            setMax={setMax}
            validateMaxDepositValue={validateMaxDepositValue}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            minimumDeposit={minimumDeposit}
            depositLimitExceeded={depositLimitExceeded}
            dataTestIdPrefix="vault-listItemDepositModal"
          />
          <DepositVaultInfo
            vaultItemData={vaultItemData}
            deposit={deposit}
            sharedToken={sharedToken}
            performanceFee={performanceFee}
          />
          {isWalletFetching &&
            (BigNumber(walletBalance)
              .dividedBy(10 ** 18)
              .isLessThan(BigNumber(deposit)) ||
              walletBalance == "0") && (
              <ErrorBox sx={{ marginBottom: 0 }}>
                <InfoIcon />
                <Typography>
                  Wallet balance is not enough to deposit.
                </Typography>
              </ErrorBox>
            )}
          {isTfVaultType && !isUserKycPassed && activeTfPeriod === 0 && (
            <WarningBox>
              <InfoIcon
                sx={{ width: "20px", color: "#F5953D", height: "20px" }}
              />
              <Box flexDirection="column">
                <Typography width="100%">
                  Only KYC-verified users can deposit. Please completing KYC at{" "}
                  <a
                    href={"https://kyc.tradeflow.network/"}
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    https://kyc.tradeflow.network/
                  </a>
                </Typography>
              </Box>
            </WarningBox>
          )}
          {activeTfPeriod === 1 && (
            <WarningBox>
              <InfoIcon
                sx={{ width: "20px", color: "#F5953D", height: "20px" }}
              />
              <Box flexDirection="column">
                <Typography width="100%">
                  Deposit period has been completed.
                </Typography>
              </Box>
            </WarningBox>
          )}
          {approveBtn && walletBalance !== "0" && (
            <InfoBoxV2>
              <InfoIcon />
              <Box flexDirection="column">
                <Typography width="100%">
                  First-time connect? Please allow token approval in your
                  MetaMask
                </Typography>
              </Box>
            </InfoBoxV2>
          )}
          <ModalButtonWrapper>
            <ButtonSecondary
              onClick={onClose}
              disabled={approvalPending || openDepositLoading}
              data-testid="vault-listItemDepositModal-closeButton"
            >
              Close
            </ButtonSecondary>
            {!account ? (
              <WalletConnectBtn />
            ) : approveBtn && walletBalance !== "0" ? (
              <ButtonPrimary
                onClick={approve}
                disabled={
                  !!Object.keys(errors).length ||
                  (isTfVaultType && !isUserKycPassed) ||
                  (isTfVaultType && activeTfPeriod > 0) ||
                  approvalPending
                }
                data-testid="vault-listItemDepositModal-approveButton"
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
                  openDepositLoading ||
                  approveBtn ||
                  !!Object.keys(errors).length ||
                  (isTfVaultType && !isUserKycPassed) ||
                  (isTfVaultType && activeTfPeriod > 0)
                }
                isLoading={openDepositLoading}
                data-testid="vault-listItemDepositModal-depositButton"
              >
                {openDepositLoading ? (
                  <CircularProgress sx={{ color: "#0D1526" }} size={20} />
                ) : (
                  "Deposit"
                )}
              </ButtonPrimary>
            )}
          </ModalButtonWrapper>
        </FormProvider>
      </DialogContent>
    </VaultManageGridDialogWrapper>
  );
};

export default memo(VaultListItemDepositModal);
