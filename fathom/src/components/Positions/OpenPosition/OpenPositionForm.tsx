import React from "react";
import { Controller } from "react-hook-form";
import BigNumber from "bignumber.js";
import {
  Box,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import {
  ApproveBox,
  ApproveBoxTypography,
  Summary,
  WalletBalance,
} from "components/AppComponents/AppBox/AppBox";
import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ApproveButton,
  ButtonPrimary,
  ButtonSecondary,
  ButtonsWrapper,
  MaxButton,
} from "components/AppComponents/AppButton/AppButton";
import useOpenPositionContext from "context/openPosition";
import {
  FXD_MINIMUM_BORROW_AMOUNT
} from "helpers/Constants";
import { ErrorBox, ErrorMessage } from "components/AppComponents/AppBox/AppBox";

const OpenPositionFormWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const DangerErrorBox = styled(ErrorBox)`
  margin-bottom: 60px;
  margin-top: 24px;
`

const OpenPositionForm = () => {
  const {
    approveBtn,
    approve,
    approvalPending,
    fxdToBeBorrowed,
    balance,
    safeMax,
    openPositionLoading,
    setMax,
    setSafeMax,
    onSubmit,
    control,
    handleSubmit,
    availableFathomInPool,
    onClose,
    pool,
    dangerSafetyBuffer,
    maxBorrowAmount
  } = useOpenPositionContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <OpenPositionFormWrapper item>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Summary>Summary</Summary>

        <Controller
          control={control}
          name="collateral"
          rules={{
            required: true,
            min: 1,
            max: BigNumber(balance)
              .dividedBy(10 ** 18)
              .toString(),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Collateral</AppFormLabel>
              {balance ? (
                <WalletBalance>
                  Wallet Available:{" "}
                  {BigNumber(balance)
                    .dividedBy(10 ** 18)
                    .toString()}{" "}
                  {pool.poolName}
                </WalletBalance>
              ) : null}
              <AppTextField
                error={!!error}
                id="outlined-helperText"
                placeholder={"0"}
                helperText={
                  <>
                    {error && error.type === "max" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          You do not have enough {pool.poolName}
                        </Box>
                      </>
                    )}
                    {error && error.type === "required" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Collateral amount is required
                        </Box>
                      </>
                    )}
                    {error && error.type === "min" && (
                      <>
                        <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                        <Box
                          component={"span"}
                          sx={{ fontSize: "12px", paddingLeft: "6px" }}
                        >
                          Minimum collateral amount is 1.
                        </Box>
                      </>
                    )}
                  </>
                }
                value={value}
                type="number"
                onChange={onChange}
              />
              <AppFormInputLogo
                src={getTokenLogoURL(
                  pool?.poolName?.toUpperCase() === "XDC"
                    ? "WXDC"
                    : pool?.poolName
                )}
              />
              <MaxButton onClick={() => setMax(balance)}>Max</MaxButton>
            </AppFormInputWrapper>
          )}
        />
        <Controller
          control={control}
          name="fathomToken"
          rules={{
            required: true,
            min: FXD_MINIMUM_BORROW_AMOUNT,
            max: maxBorrowAmount,
            validate: (value) => {
              if (Number(value) > availableFathomInPool) {
                return "Not enough FXD in pool";
              }

              if (Number(value) > safeMax) {
                return `You can't borrow more than ${fxdToBeBorrowed}`;
              }

              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapper>
                <AppFormLabel>Borrow Amount</AppFormLabel>
                <AppTextField
                  error={!!error || dangerSafetyBuffer}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "validate" && (
                        <>
                          <InfoIcon
                            sx={{
                              float: "left",
                              fontSize: "18px",
                            }}
                          />
                          <Box
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                            component={"span"}
                          >
                            {error?.message}
                          </Box>
                        </>
                      )}
                      {error && error.type === "min" && (
                        <>
                          <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Minimum borrow amount is {FXD_MINIMUM_BORROW_AMOUNT}
                            .
                          </Box>
                        </>
                      )}
                      {error && error.type === "max" && (
                        <>
                          <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                          <Box
                            component={"span"}
                            sx={{ fontSize: "12px", paddingLeft: "6px" }}
                          >
                            Maximum borrow amount is {maxBorrowAmount}.
                          </Box>
                        </>
                      )}
                      {(!error || error.type === "required") &&
                        "Enter the desired FXD."}
                    </>
                  }
                  value={value}
                  type="number"
                  placeholder={"0"}
                  onChange={onChange}
                />
                <AppFormInputLogo src={getTokenLogoURL("FXD")} />
                {safeMax > 0 ? (
                  <MaxButton onClick={setSafeMax}>Safe Max</MaxButton>
                ) : null}
              </AppFormInputWrapper>
            );
          }}
        />
        {approveBtn && !!parseInt(balance) && (
          <ApproveBox>
            <InfoIcon
              sx={{
                color: "#7D91B5",
                float: "left",
                marginRight: "10px",
              }}
            />
            <ApproveBoxTypography>
              First-time connect? Please allow token approval in your MetaMask
            </ApproveBoxTypography>
            <ApproveButton onClick={approve}>
              {" "}
              {approvalPending ? (
                <CircularProgress size={20} sx={{ color: "#0D1526" }} />
              ) : (
                "Approve"
              )}{" "}
            </ApproveButton>
          </ApproveBox>
        )}
        { dangerSafetyBuffer ? (
          <DangerErrorBox>
            <InfoIcon
              sx={{ width: "16px", color: "#F5953D", height: "16px" }}
            />
            <ErrorMessage>
              Safety Buffer is moved into the danger zone. We recommend
              borrowing a lesser amount of FXD. Otherwise, your position may be
              at risk of liquidation if the price of collateral will drop.
            </ErrorMessage>
          </DangerErrorBox>
        ) : null}
        <ButtonsWrapper>
          {!isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
          <ButtonPrimary
            type="submit"
            disabled={approveBtn}
            isLoading={openPositionLoading}
          >
            {openPositionLoading ? (
              <CircularProgress sx={{ color: "#0D1526" }} size={20} />
            ) : (
              "Open this position"
            )}
          </ButtonPrimary>
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </Box>
    </OpenPositionFormWrapper>
  );
};

export default OpenPositionForm;
