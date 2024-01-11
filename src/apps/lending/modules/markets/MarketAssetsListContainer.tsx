import { API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import { Trans } from "@lingui/macro";
import {
  Box,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { NoSearchResults } from "apps/lending/components/NoSearchResults";
import { Link } from "apps/lending/components/primitives/Link";
import { Warning } from "apps/lending/components/primitives/Warning";
import { TitleWithSearchBar } from "apps/lending/components/TitleWithSearchBar";
import { MarketWarning } from "apps/lending/components/transactions/Warnings/MarketWarning";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import MarketAssetsList from "apps/lending/modules/markets/MarketAssetsList";
import { useRootStore } from "apps/lending/store/root";
import { fetchIconSymbolAndName } from "apps/lending/ui-config/reservePatches";

import { GENERAL } from "apps/lending/utils/mixPanelEvents";

export const MarketAssetsListContainer = () => {
  const { reserves, loading } = useAppDataContext();
  const { currentMarketData, currentNetworkConfig } = useProtocolDataContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const trackEvent = useRootStore((store) => store.trackEvent);

  const filteredData = reserves
    // Filter out any non-active reserves
    .filter((res) => res.isActive)
    // Filter out all GHO, as we deliberately display it on supported markets
    // filter out any that don't meet search term criteria
    .filter((res) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        res.symbol.toLowerCase().includes(term) ||
        res.name.toLowerCase().includes(term) ||
        res.underlyingAsset.toLowerCase().includes(term)
      );
    })
    // Transform the object for list to consume it
    .map((reserve) => ({
      ...reserve,
      ...(reserve.isWrappedBaseAsset
        ? fetchIconSymbolAndName({
            symbol: currentNetworkConfig.baseAssetSymbol,
            underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
          })
        : {}),
    }));
  const marketFrozen = !reserves.some((reserve) => !reserve.isFrozen);
  const showFrozenMarketWarning =
    marketFrozen &&
    ["Harmony", "Fantom", "Ethereum AMM"].includes(
      currentMarketData.marketTitle
    );
  const unfrozenReserves = filteredData.filter(
    (r) => !r.isFrozen && !r.isPaused
  );
  const [showFrozenMarketsToggle, setShowFrozenMarketsToggle] = useState(false);

  const handleChange = () => {
    setShowFrozenMarketsToggle((prevState) => !prevState);
  };

  const frozenOrPausedReserves = filteredData.filter(
    (r) => r.isFrozen || r.isPaused
  );

  return (
    <ListWrapper
      titleComponent={
        <TitleWithSearchBar
          onSearchTermChange={setSearchTerm}
          title={
            <>
              {currentMarketData.marketTitle} <Trans>assets</Trans>
            </>
          }
          searchPlaceholder={
            sm ? "Search asset" : "Search asset name, symbol, or address"
          }
        />
      }
    >
      {showFrozenMarketWarning && (
        <Box mx={6}>
          <MarketWarning marketName={currentMarketData.marketTitle} forum />
        </Box>
      )}

      {/* Unfrozen assets list */}
      <MarketAssetsList reserves={unfrozenReserves} loading={loading} />

      {/* Frozen or paused assets list */}
      {frozenOrPausedReserves.length > 0 && (
        <Box sx={{ mt: 10, px: { xs: 4, xsm: 6 } }}>
          <Typography variant="h4" mb={4}>
            <Trans>Show Frozen or paused assets</Trans>

            <Switch
              checked={showFrozenMarketsToggle}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Typography>
          {showFrozenMarketsToggle && (
            <Warning severity="info">
              <Trans>
                These assets are temporarily frozen or paused by Aave community
                decisions, meaning that further supply / borrow, or rate swap of
                these assets are unavailable. Withdrawals and debt repayments
                are allowed. Follow the{" "}
                <Link
                  onClick={() => {
                    trackEvent(GENERAL.EXTERNAL_LINK, {
                      link: "Frozen Market Markets Page",
                      frozenMarket: currentNetworkConfig.name,
                    });
                  }}
                  href="https://governance.aave.com"
                  underline="always"
                >
                  Aave governance forum
                </Link>{" "}
                for further updates.
              </Trans>
            </Warning>
          )}
        </Box>
      )}
      {showFrozenMarketsToggle && (
        <MarketAssetsList reserves={frozenOrPausedReserves} loading={loading} />
      )}

      {/* Show no search results message if nothing hits in either list */}
      {!loading && filteredData.length === 0 && (
        <NoSearchResults
          searchTerm={searchTerm}
          subtitle={
            <Trans>
              We couldn&apos;t find any assets related to your search. Try again
              with a different asset name, symbol, or address.
            </Trans>
          }
        />
      )}
    </ListWrapper>
  );
};