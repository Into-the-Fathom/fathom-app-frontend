import React, {
  FC,
  useMemo
} from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  ApproveBox,
  ApproveBoxTypography,
  Summary,
  WalletBalance
} from "components/AppComponents/AppBox/AppBox";

import {
  AppFormInputLogo,
  AppFormInputWrapper,
  AppFormLabel,
  AppTextField
} from "components/AppComponents/AppForm/AppForm";
import InfoIcon from "@mui/icons-material/Info";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  ApproveButton,
  ButtonPrimary,
  ButtonSecondary,
  ButtonsWrapper,
  ManagePositionRepayTypeWrapper,
  ManageTypeButton,
  MaxButton
} from "components/AppComponents/AppButton/AppButton";

import useTopUpPositionContext from "context/topUpPosition";
import { styled } from "@mui/material/styles";
import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";
import BigNumber from "bignumber.js";
import {
  FXD_MINIMUM_BORROW_AMOUNT,
  FXD_MAXIMUM_BORROW_AMOUNT
} from "helpers/Constants";

const TopUpPositionFormWrapper = styled(Grid)`
  padding-left: 20px;
  width: calc(50% - 1px);
  position: relative;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

const TopUpForm = styled("form")`
  padding-bottom: 45px;
`;

const TopUpPositionForm: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setClosePosition,
  setTopUpPosition
}) => {
  const {
    pool,
    approveBtn,
    approve,
    approvalPending,
    balance,
    safeMax,
    openPositionLoading,
    setMax,
    setSafeMax,
    onSubmit,
    control,
    handleSubmit,
    onClose,
    switchPosition
  } = useTopUpPositionContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const availableFathomInPool = useMemo(() => {
    return pool.availableFathomInPool;
  }, [pool]);

  return (
    <TopUpPositionFormWrapper item>
      <TopUpForm
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Summary>Summary</Summary>
        <ManagePositionRepayTypeWrapper>
          <ManageTypeButton
            sx={{ marginRight: "5px" }}
            className={`${!!topUpPosition ? "active" : null}`}
            onClick={() => !topUpPosition && switchPosition(setTopUpPosition)}
          >
            Top Up Position
          </ManageTypeButton>
          <ManageTypeButton
            className={`${!!closePosition ? "active" : null}`}
            onClick={() => !closePosition && switchPosition(setClosePosition)}
          >
            Repay Position
          </ManageTypeButton>
        </ManagePositionRepayTypeWrapper>
        <Controller
          control={control}
          name="collateral"
          rules={{
            required: false,
            min: 0,
            max: BigNumber(balance).dividedBy(10 ** 18).toNumber()
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AppFormInputWrapper>
              <AppFormLabel>Collateral</AppFormLabel>
              {balance ? (
                <WalletBalance>
                  Wallet Available: {BigNumber(balance).dividedBy(10 ** 18).toNumber()} {pool.poolName}
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
          key={safeMax}
          control={control}
          name="fathomToken"
          rules={{
            validate: (value) => {
              if (BigNumber(value).isGreaterThan(availableFathomInPool)) {
                return "Not enough FXD in pool";
              }

              if (BigNumber(value).isGreaterThan(safeMax)) {
                return `You can't borrow more than ${safeMax}`;
              }

              return true;
            },
            min: FXD_MINIMUM_BORROW_AMOUNT,
            max: FXD_MAXIMUM_BORROW_AMOUNT
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <AppFormInputWrapper>
                <AppFormLabel>Borrow Amount</AppFormLabel>
                <AppTextField
                  error={!!error}
                  id="outlined-helperText"
                  helperText={
                    <>
                      {error && error.type === "validate" && (
                        <>
                          <InfoIcon
                            sx={{
                              float: "left",
                              fontSize: "18px"
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
                            Minimum borrow amount is {FXD_MINIMUM_BORROW_AMOUNT}.
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
                            Maximum borrow amount is {FXD_MAXIMUM_BORROW_AMOUNT}.
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
                marginRight: "10px"
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
              "Top Up this position"
            )}
          </ButtonPrimary>
          {isMobile && (
            <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>
          )}
        </ButtonsWrapper>
      </TopUpForm>
    </TopUpPositionFormWrapper>
  );
};

export default TopUpPositionForm;
