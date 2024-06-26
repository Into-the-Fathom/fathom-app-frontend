import { FC, memo, useMemo } from "react";
import { Box, styled } from "@mui/material";
import BigNumber from "bignumber.js";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";

import { IVault, IVaultPosition } from "fathom-sdk";
import { FormType } from "hooks/Vaults/useVaultManageDeposit";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import usePricesContext from "context/prices";

import {
  AppFlexBox,
  VaultWalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import { MaxButtonV2 } from "components/AppComponents/AppButton/AppButton";
import {
  AppFormInputErrorWrapper,
  AppFormInputLogoV2,
  AppFormInputUsdIndicator,
  AppFormInputWrapperV2,
  AppFormLabelRow,
  AppFormLabelV2,
  AppTextFieldV2,
} from "components/AppComponents/AppForm/AppForm";
import { InfoIcon } from "components/Governance/Propose";

const ManageVaultItemFormWrapper = styled(Box)`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 24px 16px;
`;

const ManageVaultFormStyled = styled("form")`
  padding-bottom: 0;
`;

type VaultManageFormProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  balanceToken: string;
  walletBalance: string;
  control: Control<
    {
      formToken: string;
      formSharedToken: string;
    },
    any
  >;
  formType: FormType;
  setMax: () => void;
  validateMaxValue: (value: string) => true | string;
  handleSubmit: UseFormHandleSubmit<
    {
      formToken: string;
      formSharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  depositLimitExceeded: (value: string) => string | boolean;
  dataTestIdPrefix?: string;
};

const ManageVaultForm: FC<VaultManageFormProps> = ({
  vaultItemData,
  balanceToken,
  walletBalance,
  control,
  formType,
  setMax,
  validateMaxValue,
  handleSubmit,
  onSubmit,
  depositLimitExceeded,
  dataTestIdPrefix,
}) => {
  const { token, balanceTokens, depositLimit, shutdown } = vaultItemData;
  const { fxdPrice } = usePricesContext();
  const formattedBalanceToken = useMemo(
    () =>
      BigNumber(balanceToken)
        .dividedBy(10 ** 18)
        .toNumber(),
    [balanceToken]
  );

  return (
    <ManageVaultItemFormWrapper>
      <ManageVaultFormStyled
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Controller
          control={control}
          name="formToken"
          rules={{
            required: true,
            min: 0.000000000000000000001,
            validate: validateMaxValue,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapperV2>
              <AppFormLabelRow>
                <AppFormLabelV2>
                  {formType === FormType.DEPOSIT
                    ? `Deposit ${token?.name}`
                    : `Withdraw ${token?.name}`}
                </AppFormLabelV2>
                <AppFlexBox sx={{ width: "auto", justifyContent: "flex-end" }}>
                  <VaultWalletBalance>
                    {formType === FormType.DEPOSIT
                      ? "Balance: " +
                        formatNumber(
                          BigNumber(walletBalance)
                            .dividedBy(10 ** 18)
                            .toNumber()
                        ) +
                        " " +
                        token?.name
                      : "Vault Available: " +
                        formatNumber(formattedBalanceToken) +
                        " " +
                        token?.name}
                  </VaultWalletBalance>
                </AppFlexBox>
              </AppFormLabelRow>
              <AppTextFieldV2
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {!shutdown && depositLimitExceeded(value) && (
                      <AppFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            width: "14px",
                            height: "14px",
                            marginRight: "0",
                          }}
                        />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          {depositLimitExceeded(value)}
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                    {error && error.type === "required" && (
                      <AppFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            width: "14px",
                            height: "14px",
                            marginRight: "0",
                          }}
                        />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          This field is required
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                    {error && error.type === "validate" && (
                      <AppFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            width: "14px",
                            height: "14px",
                            marginRight: "0",
                          }}
                        />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          {error.message}
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                    {error && error.type === "min" && (
                      <AppFormInputErrorWrapper>
                        <InfoIcon
                          sx={{
                            float: "left",
                            width: "14px",
                            height: "14px",
                            marginRight: "0",
                          }}
                        />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          This field should be positive.
                        </Box>
                      </AppFormInputErrorWrapper>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
                data-testid={
                  dataTestIdPrefix !== undefined
                    ? `${dataTestIdPrefix}-${
                        formType === FormType.DEPOSIT
                          ? "depositInputWrapper"
                          : "withdrawInputWrapper"
                      }`
                    : null
                }
              />
              <AppFormInputUsdIndicator>{`$${formatNumber(
                BigNumber(value || 0)
                  .multipliedBy(fxdPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}`}</AppFormInputUsdIndicator>
              <AppFormInputLogoV2
                className={"extendedInput"}
                src={getTokenLogoURL(token?.symbol)}
                alt={token?.name}
              />
              <MaxButtonV2
                onClick={() => setMax()}
                data-testid={
                  dataTestIdPrefix !== undefined
                    ? `${dataTestIdPrefix}-${
                        formType === FormType.DEPOSIT
                          ? "depositInput-maxButton"
                          : "withdrawInput-maxButton"
                      }`
                    : null
                }
              >
                Max
              </MaxButtonV2>
            </AppFormInputWrapperV2>
          )}
        />
        <Controller
          control={control}
          name="formSharedToken"
          rules={{
            max:
              formType === FormType.DEPOSIT
                ? BigNumber(depositLimit)
                    .minus(BigNumber(balanceTokens))
                    .dividedBy(10 ** 18)
                    .toNumber()
                : undefined,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapperV2>
                <AppFormLabelRow>
                  <AppFormLabelV2>
                    {formType === FormType.DEPOSIT
                      ? "Receive shares token"
                      : "Burn Shares token"}
                  </AppFormLabelV2>
                </AppFormLabelRow>
                <AppTextFieldV2
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "max" && (
                        <AppFormInputErrorWrapper>
                          <InfoIcon
                            sx={{
                              float: "left",
                              width: "14px",
                              height: "14px",
                              marginRight: "0",
                            }}
                          />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Maximum available share token is{" "}
                            {formatNumber(
                              BigNumber(depositLimit)
                                .minus(BigNumber(balanceTokens))
                                .dividedBy(10 ** 18)
                                .toNumber()
                            )}
                            .
                          </Box>
                        </AppFormInputErrorWrapper>
                      )}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                  disabled
                  data-testid={
                    dataTestIdPrefix !== undefined
                      ? `${dataTestIdPrefix}-${
                          formType === FormType.DEPOSIT
                            ? "receiveSharesInputWrapper"
                            : "burnSharesInputWrapper"
                        }`
                      : null
                  }
                />
                <AppFormInputLogoV2 src={getTokenLogoURL("FXD")} />
              </AppFormInputWrapperV2>
            );
          }}
        />
      </ManageVaultFormStyled>
    </ManageVaultItemFormWrapper>
  );
};

export default memo(ManageVaultForm);
