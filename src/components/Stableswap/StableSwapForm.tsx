import { FC, useMemo, memo } from "react";
import BigNumber from "bignumber.js";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import InfoIcon from "@mui/icons-material/Info";
import { FathomSwapChangeCurrencyButton } from "components/AppComponents/AppButton/AppButton";
import ComboShareSrc from "assets/svg/combo-shape.svg";
import {
  StableSwapFormLabel,
  StableSwapInputWrapper,
  StableSwapMaxButton,
  StableSwapTextField,
  StableSwapWalletBalance,
} from "components/Stableswap/StableSwap";
import { styled } from "@mui/material/styles";

import {
  SuccessBox,
  ErrorBox,
  ErrorMessage,
} from "components/AppComponents/AppBox/AppBox";
import { formatPercentage } from "utils/format";

const StableSwapErrorBox = styled(ErrorBox)`
  width: 100%;
  margin: 0;
  margin: 20px 0 0;
`;

const ErrorInfoIcon = styled(InfoIcon)`
  width: 16px;
  color: #f5953d;
  height: 16px;
`;

const StableSwapCurrencySelect = styled(Select)`
  background: #253656;
  border: 1px solid #324567;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;
  height: 32px;
  width: 118px;
  position: absolute;
  left: 32px;
  top: 41px;
  z-index: 1;
  padding-top: 4px;

  .MuiSelect-select {
    padding-left: 12px;
  }
`;

const StableSwapSuccessBox = styled(SuccessBox)`
  width: 100%;
  margin: 0;
`;

const StableSwapForm: FC<any> = ({
  isDecentralizedState,
  isUserWhiteListed,
  isUserWrapperWhiteListed,
  inputValue,
  outputValue,
  inputDecimals,
  outputDecimals,
  handleInputValueTextFieldChange,
  handleOutputValueTextFieldChange,
  inputCurrency,
  outputCurrency,
  setInputCurrencyHandler,
  setOutputCurrencyHandler,
  inputBalance,
  outputBalance,
  changeCurrenciesPosition,
  setMax,
  inputError,
  options,
  fxdAvailable,
  usStableAvailable,
}) => {
  const outputError = useMemo(() => {
    return BigNumber(
      outputCurrency === options[0] ? usStableAvailable : fxdAvailable
    ).isLessThan(outputValue);
  }, [outputCurrency, usStableAvailable, fxdAvailable, outputValue]);

  return (
    <>
      <StableSwapInputWrapper>
        <StableSwapFormLabel>From</StableSwapFormLabel>
        {useMemo(
          () => (
            <StableSwapWalletBalance>
              Balance:{" "}
              {formatPercentage(
                BigNumber(inputBalance)
                  .dividedBy(10 ** inputDecimals)
                  .toNumber()
              )}{" "}
              {inputCurrency}
            </StableSwapWalletBalance>
          ),
          [inputBalance, inputCurrency, inputDecimals]
        )}
        <StableSwapCurrencySelect
          value={inputCurrency}
          onChange={(event: SelectChangeEvent<unknown>) => {
            setInputCurrencyHandler(event.target.value);
          }}
        >
          {useMemo(
            () =>
              options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  <Box sx={{ float: "left", paddingRight: "10px" }}>
                    <img width={16} src={getTokenLogoURL(option)} alt={""} />
                  </Box>
                  {option}
                </MenuItem>
              )),
            [options]
          )}
        </StableSwapCurrencySelect>

        <StableSwapTextField
          error={!!inputError}
          size="small"
          type="number"
          placeholder="0.00"
          value={inputValue}
          onChange={handleInputValueTextFieldChange}
          helperText={
            inputError ? (
              <>
                <InfoIcon sx={{ float: "left", fontSize: "18px" }} />
                <Typography>{inputError}</Typography>
              </>
            ) : null
          }
        />
        <StableSwapMaxButton onClick={setMax}>Max</StableSwapMaxButton>

        <FathomSwapChangeCurrencyButton
          onClick={() => changeCurrenciesPosition(inputValue, outputValue)}
        >
          <img src={ComboShareSrc} alt="combo-share" />
        </FathomSwapChangeCurrencyButton>
      </StableSwapInputWrapper>

      <StableSwapInputWrapper>
        <StableSwapFormLabel>To</StableSwapFormLabel>
        {useMemo(
          () => (
            <StableSwapWalletBalance>
              Balance:{" "}
              {formatPercentage(
                BigNumber(outputBalance)
                  .dividedBy(10 ** outputDecimals)
                  .toNumber()
              )}{" "}
              {outputCurrency}
            </StableSwapWalletBalance>
          ),
          [outputBalance, outputCurrency, outputDecimals]
        )}
        <StableSwapCurrencySelect
          value={outputCurrency}
          onChange={(event: SelectChangeEvent<unknown>) => {
            setOutputCurrencyHandler(event.target.value);
          }}
          disabled={true}
        >
          {useMemo(
            () =>
              options.map((option: string) => (
                <MenuItem key={option} value={option}>
                  <Box sx={{ float: "left", paddingRight: "10px" }}>
                    <img width={16} src={getTokenLogoURL(option)} alt={""} />
                  </Box>
                  {option}
                </MenuItem>
              )),
            [options]
          )}
        </StableSwapCurrencySelect>

        <StableSwapTextField
          error={outputError}
          disabled={true}
          size="small"
          type="number"
          placeholder="0.00"
          className={outputError ? "error" : ""}
          value={outputValue}
          onChange={handleOutputValueTextFieldChange}
          helperText={outputError ? "Not enough liquidity in pool" : ""}
        />
      </StableSwapInputWrapper>

      {isDecentralizedState === false && (
        <StableSwapSuccessBox>
          <InfoIcon />
          <Typography>Whitelist Activated.</Typography>
        </StableSwapSuccessBox>
      )}

      {isUserWhiteListed === false && isUserWrapperWhiteListed === false && (
        <StableSwapErrorBox>
          <ErrorInfoIcon />
          <ErrorMessage>Wallet Address is not whitelisted.</ErrorMessage>
        </StableSwapErrorBox>
      )}
    </>
  );
};

export default memo(StableSwapForm);
