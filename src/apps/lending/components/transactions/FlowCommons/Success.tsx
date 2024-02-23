import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { FC, ReactNode, useState } from "react";
import { WalletIcon } from "apps/lending/components/icons/WalletIcon";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import {
  Base64Token,
  TokenIcon,
} from "apps/lending/components/primitives/TokenIcon";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { ERC20TokenType } from "apps/lending/libs/web3-data-provider/Web3Provider";

import { BaseSuccessView } from "apps/lending/components/transactions/FlowCommons/BaseSuccess";

export type SuccessTxViewProps = {
  txHash?: string;
  action?: ReactNode;
  amount?: string;
  symbol?: string;
  collateral?: boolean;
  rate?: InterestRate;
  addToken?: ERC20TokenType;
  customAction?: ReactNode;
  customText?: ReactNode;
};

export const TxSuccessView: FC<SuccessTxViewProps> = ({
  txHash,
  action,
  amount,
  symbol,
  collateral,
  rate,
  addToken,
  customAction,
  customText,
}) => {
  const { addERC20Token } = useWeb3Context();
  const [base64, setBase64] = useState("");
  const theme = useTheme();

  return (
    <BaseSuccessView txHash={txHash}>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {action && amount && symbol && (
          <Typography>
            You {action}{" "}
            <FormattedNumber
              value={Number(amount)}
              compact
              variant="secondary14"
            />{" "}
            {symbol}
          </Typography>
        )}

        {customAction && (
          <Typography>
            {customText}
            {customAction}
          </Typography>
        )}

        {!action && !amount && symbol && (
          <Typography>
            Your {symbol} {collateral ? "is not" : "now"} used as collateral
          </Typography>
        )}

        {rate && (
          <Typography>
            You switched to{" "}
            {rate === InterestRate.Variable ? "variable" : "stable"} rate
          </Typography>
        )}

        {addToken && symbol && (
          <Box
            sx={(theme) => ({
              border:
                theme.palette.mode === "dark"
                  ? `1px solid ${theme.palette.divider}`
                  : "none",
              background: theme.palette.mode === "dark" ? "none" : "#F7F7F9",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: "24px",
            })}
          >
            <TokenIcon
              symbol={addToken.symbol}
              aToken={!!(addToken && addToken.aToken)}
              sx={{ fontSize: "32px", mt: "12px", mb: "8px" }}
            />
            <Typography
              variant="description"
              color="text.primary"
              sx={{ mx: "24px" }}
            >
              Add{" "}
              {addToken && addToken.aToken
                ? `a${addToken.symbol} `
                : `${addToken.symbol} `}{" "}
              to wallet to track your balance.
            </Typography>
            <Button
              onClick={() => {
                addERC20Token({
                  address: addToken.address,
                  decimals: addToken.decimals,
                  symbol: addToken.aToken
                    ? `a${addToken.symbol}`
                    : addToken.symbol,
                  image: !/_/.test(addToken.symbol) ? base64 : undefined,
                });
              }}
              variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
              size="medium"
              sx={{ mt: "8px", mb: "12px" }}
            >
              {addToken.symbol && !/_/.test(addToken.symbol) && (
                <Base64Token
                  symbol={addToken.symbol}
                  onImageGenerated={setBase64}
                  aToken={addToken.aToken}
                />
              )}
              <WalletIcon
                sx={{
                  width: "20px",
                  height: "20px",
                  stroke: theme.palette.primary.main,
                }}
              />
              <Typography variant="buttonM" color="white" ml="4px">
                Add to wallet
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    </BaseSuccessView>
  );
};
