import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Menu, MenuItem, SvgIcon, Typography } from "@mui/material";
import * as React from "react";
import { FC, memo, useState } from "react";
import { CircleIcon } from "apps/lending/components/CircleIcon";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";

import { RESERVE_DETAILS } from "apps/lending/utils/mixPanelEvents";

interface TokenLinkDropdownProps {
  poolReserve: ComputedReserveData;
  downToSM: boolean;
  hideAToken?: boolean;
}

export const TokenLinkDropdown: FC<TokenLinkDropdownProps> = memo(
  ({ poolReserve, downToSM, hideAToken }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { currentNetworkConfig, currentMarket } = useProtocolDataContext();
    const open = Boolean(anchorEl);
    const trackEvent = useRootStore((store) => store.trackEvent);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      trackEvent(RESERVE_DETAILS.RESERVE_TOKENS_DROPDOWN, {
        assetName: poolReserve.name,
        asset: poolReserve.underlyingAsset,
        fmToken: poolReserve.aTokenAddress,
        market: currentMarket,
        variableDebtToken: poolReserve.variableDebtTokenAddress,
      });
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    if (!poolReserve) {
      return null;
    }
    const showDebtTokenHeader =
      poolReserve.borrowingEnabled || poolReserve.stableBorrowRateEnabled;

    return (
      <>
        <Box onClick={handleClick}>
          <CircleIcon tooltipText={"View token contracts"} downToSM={downToSM}>
            <Box
              sx={(theme) => ({
                display: "inline-flex",
                alignItems: "center",
                color: theme.palette.other.fathomAccentMute,
                "&:hover": { color: theme.palette.other.fathomAccent },
                cursor: "pointer",
              })}
            >
              <SvgIcon sx={{ fontSize: "14px" }}>
                <OpenInNewIcon />
              </SvgIcon>
            </Box>
          </CircleIcon>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          keepMounted={true}
          data-cy="addToWaletSelector"
        >
          <Box sx={{ px: 4, pt: 3, pb: 2 }}>
            <Typography variant="secondary12" color="text.secondary">
              Underlying token
            </Typography>
          </Box>

          <MenuItem
            onClick={() => {
              trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                type: "Underlying Token",
                assetName: poolReserve.name,
                asset: poolReserve.underlyingAsset,
                fmToken: poolReserve.aTokenAddress,
                market: currentMarket,
                variableDebtToken: poolReserve.variableDebtTokenAddress,
              });
            }}
            component="a"
            href={currentNetworkConfig.explorerLinkBuilder({
              address: poolReserve?.underlyingAsset,
            })}
            target="_blank"
            divider
          >
            <TokenIcon
              symbol={poolReserve.iconSymbol}
              sx={{ fontSize: "20px" }}
            />
            <Typography
              variant="subheader1"
              sx={{ ml: 3 }}
              noWrap
              data-cy={`assetName`}
            >
              {poolReserve.symbol}
            </Typography>
          </MenuItem>

          {!hideAToken && (
            <Box>
              <Box sx={{ px: 4, pt: 3, pb: 2 }}>
                <Typography variant="secondary12" color="text.secondary">
                  fmToken
                </Typography>
              </Box>

              <MenuItem
                component="a"
                onClick={() => {
                  trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                    type: "fmToken",
                    assetName: poolReserve.name,
                    asset: poolReserve.underlyingAsset,
                    fmToken: poolReserve.aTokenAddress,
                    market: currentMarket,
                    variableDebtToken: poolReserve.variableDebtTokenAddress,
                  });
                }}
                href={currentNetworkConfig.explorerLinkBuilder({
                  address: poolReserve?.aTokenAddress,
                })}
                target="_blank"
                divider={showDebtTokenHeader}
              >
                <TokenIcon
                  symbol={poolReserve.iconSymbol}
                  fmToken={true}
                  sx={{ fontSize: "20px" }}
                />
                <Typography
                  variant="subheader1"
                  sx={{ ml: 3 }}
                  noWrap
                  data-cy={`assetName`}
                >
                  {`fm${poolReserve.symbol}`}
                </Typography>
              </MenuItem>
            </Box>
          )}

          {showDebtTokenHeader && (
            <Box sx={{ px: 4, pt: 3, pb: 2 }}>
              <Typography variant="secondary12" color="text.secondary">
                Fathom lending debt token
              </Typography>
            </Box>
          )}
          {poolReserve.borrowingEnabled && (
            <MenuItem
              component="a"
              href={currentNetworkConfig.explorerLinkBuilder({
                address: poolReserve?.variableDebtTokenAddress,
              })}
              target="_blank"
              onClick={() => {
                trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                  type: "Variable Debt",
                  assetName: poolReserve.name,
                  asset: poolReserve.underlyingAsset,
                  fmToken: poolReserve.aTokenAddress,
                  market: currentMarket,
                  variableDebtToken: poolReserve.variableDebtTokenAddress,
                });
              }}
            >
              <TokenIcon symbol="default" sx={{ fontSize: "20px" }} />
              <Typography
                variant="subheader1"
                sx={{ ml: 3 }}
                noWrap
                data-cy={`assetName`}
              >
                {"Variable debt " + poolReserve.symbol}
              </Typography>
            </MenuItem>
          )}
          {poolReserve.stableBorrowRateEnabled && (
            <MenuItem
              component="a"
              href={currentNetworkConfig.explorerLinkBuilder({
                address: poolReserve?.stableDebtTokenAddress,
              })}
              target="_blank"
              onClick={() => {
                trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                  type: "Stable Debt",
                  assetName: poolReserve.name,
                  asset: poolReserve.underlyingAsset,
                  fmToken: poolReserve.aTokenAddress,
                  market: currentMarket,
                  variableDebtToken: poolReserve.variableDebtTokenAddress,
                  stableDebtToken: poolReserve.stableDebtTokenAddress,
                });
              }}
            >
              <TokenIcon symbol="default" sx={{ fontSize: "20px" }} />
              <Typography
                variant="subheader1"
                sx={{ ml: 3 }}
                noWrap
                data-cy={`assetName`}
              >
                {"Stable debt " + poolReserve.symbol}
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }
);
