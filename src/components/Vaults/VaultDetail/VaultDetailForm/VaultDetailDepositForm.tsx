import { FormProvider } from "react-hook-form";
import { Box, styled, Typography } from "@mui/material";
import useVaultContext from "context/vault";
import useSharedContext from "context/shared";
import useVaultOpenDeposit from "hooks/Vaults/useVaultOpenDeposit";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import DepositVaultForm from "components/Vaults/VaultList/DepositVaultModal/DepositVaultForm";
import DepositVaultInfo from "components/Vaults/VaultDetail/VaultDetailForm/DepositVaultInfo";

const VaultFormWrapper = styled(AppFlexBox)`
  align-items: flex-start;
  gap: 20px;
  padding-top: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    padding-top: 10px;
  }
`;

const VaultDetailFormColumn = styled(Box)`
  width: 50%;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const VaultDetailDepositForm = () => {
  const { vault } = useVaultContext();

  const onClose = () => {
    methods.reset();
  };

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
  } = useVaultOpenDeposit(vault, onClose);
  const { isMobile } = useSharedContext();

  return (
    <VaultPaper sx={{ marginBottom: isMobile ? "20px" : "24px" }}>
      <Typography variant="h3" sx={{ fontSize: isMobile ? "14px" : "16px" }}>
        Deposit
      </Typography>
      <VaultFormWrapper>
        <FormProvider {...methods}>
          <VaultDetailFormColumn>
            <DepositVaultForm
              vaultItemData={vault}
              walletBalance={walletBalance}
              control={control}
              setMax={setMax}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              validateMaxDepositValue={validateMaxDepositValue}
            />
          </VaultDetailFormColumn>
          <DepositVaultInfo
            vaultItemData={vault}
            deposit={deposit}
            sharedToken={sharedToken}
            isWalletFetching={isWalletFetching}
            walletBalance={walletBalance}
            onClose={onClose}
            openDepositLoading={openDepositLoading}
            errors={errors}
            approveBtn={approveBtn}
            approve={approve}
            approvalPending={approvalPending}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </FormProvider>
      </VaultFormWrapper>
    </VaultPaper>
  );
};

export default VaultDetailDepositForm;