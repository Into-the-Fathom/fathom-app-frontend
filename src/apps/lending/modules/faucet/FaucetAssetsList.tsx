import { valueToBigNumber } from "@aave/math-utils";
import { Trans } from "@lingui/macro";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ConnectWalletPaper } from "apps/lending/components/ConnectWalletPaper";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { ListItem } from "apps/lending/components/lists/ListItem";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "apps/lending/hooks/app-data-provider/useWalletBalances";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";

import { FaucetItemLoader } from "./FaucetItemLoader";
import { FaucetMobileItemLoader } from "./FaucetMobileItemLoader";

export default function FaucetAssetsList() {
  const { reserves, loading } = useAppDataContext();
  const { walletBalances } = useWalletBalances();
  const { openFaucet } = useModalContext();
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { currentMarket } = useProtocolDataContext();

  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));

  const listData = reserves
    .filter(
      (reserve) =>
        !reserve.isWrappedBaseAsset &&
        !reserve.isFrozen &&
        reserve.symbol !== "GHO"
    )
    .map((reserve) => {
      const walletBalance = valueToBigNumber(
        walletBalances[reserve.underlyingAsset]?.amount || "0"
      );
      return {
        ...reserve,
        walletBalance,
      };
    });

  if (!currentAccount || web3Loading) {
    return (
      <ConnectWalletPaper
        loading={web3Loading}
        description={
          <Trans>Please connect your wallet to get free testnet assets.</Trans>
        }
      />
    );
  }

  return (
    <ListWrapper
      titleComponent={
        <Typography component="div" variant="h2" sx={{ mr: 4 }}>
          <Trans>Test Assets</Trans>
        </Typography>
      }
    >
      <ListHeaderWrapper px={downToXSM ? 4 : 6}>
        <ListColumn isRow maxWidth={280}>
          <ListHeaderTitle>
            <Trans>Asset</Trans>
          </ListHeaderTitle>
        </ListColumn>

        {!downToXSM && (
          <ListColumn>
            <ListHeaderTitle>
              <Trans>Wallet balance</Trans>
            </ListHeaderTitle>
          </ListColumn>
        )}

        <ListColumn maxWidth={280} />
      </ListHeaderWrapper>

      {loading ? (
        downToXSM ? (
          <>
            <FaucetMobileItemLoader />
            <FaucetMobileItemLoader />
            <FaucetMobileItemLoader />
          </>
        ) : (
          <>
            <FaucetItemLoader />
            <FaucetItemLoader />
            <FaucetItemLoader />
            <FaucetItemLoader />
            <FaucetItemLoader />
          </>
        )
      ) : (
        listData.map((reserve) => (
          <ListItem
            px={downToXSM ? 4 : 6}
            key={reserve.symbol}
            data-cy={`faucetListItem_${reserve.symbol.toUpperCase()}`}
          >
            <ListColumn isRow maxWidth={280}>
              <Link
                href={ROUTES.reserveOverview(
                  reserve.underlyingAsset,
                  currentMarket
                )}
                noWrap
                sx={{ display: "inline-flex", alignItems: "center" }}
              >
                <TokenIcon symbol={reserve.iconSymbol} fontSize="large" />
                <Box sx={{ pl: 3.5, overflow: "hidden" }}>
                  <Typography variant="h4" noWrap>
                    {reserve.name}
                  </Typography>
                  <Typography variant="subheader2" color="text.muted" noWrap>
                    {reserve.symbol}
                  </Typography>
                </Box>
              </Link>
            </ListColumn>

            {!downToXSM && (
              <ListColumn>
                <FormattedNumber
                  compact
                  value={reserve.walletBalance.toString()}
                  variant="main16"
                />
              </ListColumn>
            )}

            <ListColumn maxWidth={280} align="right">
              <Button
                variant="gradient"
                onClick={() => openFaucet(reserve.underlyingAsset)}
              >
                <Trans>Faucet</Trans>
              </Button>
            </ListColumn>
          </ListItem>
        ))
      )}
    </ListWrapper>
  );
}