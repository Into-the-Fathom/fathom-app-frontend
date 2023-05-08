import React from "react";
import { Divider, Grid, ListItemText } from "@mui/material";
import { AppListItem } from "components/AppComponents/AppList/AppList";

import { AppList } from "components/AppComponents/AppList/AppList";

import useOpenPositionContext from "context/openPosition";
import { styled } from "@mui/material/styles";
import { formatNumber, formatNumberPrice, formatPercentage } from "utils/format";
import BigNumber from "bignumber.js";

const ListDivider = styled(Divider)`
  margin: 20px 20px 20px 5px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0 20px 0;
  }
`;

const OpenPositionInfo = () => {
  const {
    pool,
    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdToBeBorrowed,
    fxdAvailableToBorrow,
    debtRatio,
    safetyBuffer,
    liquidationPrice,
  } = useOpenPositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(collateralToBeLocked)} ${
            pool.poolName
          }`}
        >
          <ListItemText primary="Collateral to be Locked" />
        </AppListItem>
        <AppListItem
          className={'short'}
          alignItems="flex-start"
          secondaryAction={`${formatNumber(collateralAvailableToWithdraw)} ${
            pool.poolName
          }`}
        >
          <ListItemText primary="Estimated Collateral Available to Withdraw" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(fxdToBeBorrowed)} FXD`}
        >
          <ListItemText primary="FXD to be Borrowed" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(fxdAvailableToBorrow)} FXD`}
        >
          <ListItemText primary="FXD Available to Borrow" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(debtRatio)} %`}
        >
          <ListItemText primary="LTV" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${BigNumber(safetyBuffer)
            .multipliedBy(100)
            .toFixed(2)} %`}
        >
          <ListItemText primary="Safety Buffer" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`$${formatNumberPrice(liquidationPrice)}`}
        >
          <ListItemText primary={`Liquidation Price of ${pool.poolName}`} />
        </AppListItem>
        <ListDivider />
        <AppListItem alignItems="flex-start" secondaryAction={`1.73%`}>
          <ListItemText primary={`Lending APR`} />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${pool.stabilityFeeRate}%`}
        >
          <ListItemText primary={`Stability Fee`} />
        </AppListItem>
        <AppListItem alignItems="flex-start" secondaryAction={`1.96%`}>
          <ListItemText primary={`Total APR`} />
        </AppListItem>
        <AppListItem alignItems="flex-start" secondaryAction={`1.98%`}>
          <ListItemText primary={`Total APY`} />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default OpenPositionInfo;
