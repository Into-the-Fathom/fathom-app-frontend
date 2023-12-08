import React, { FC } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, Grid, ListItemText } from "@mui/material";
import { IVault } from "hooks/useVaultList";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

type VaultDepositInfoProps = {
  vaultItemData: IVault;
  deposit: string;
  sharedToken: string;
};

const DepositVaultInfo: FC<VaultDepositInfoProps> = ({
  vaultItemData,
  deposit,
  sharedToken,
}: any) => {
  const { token, shareToken, balanceTokens, strategies } = vaultItemData;

  const { totalApr, count } = strategies[0].reports.reduce(
    (accumulator: any, strategyReport: any) => {
      strategyReport.results.forEach((result: any) => {
        if (result.apr) {
          accumulator.totalApr += parseFloat(result.apr);
          accumulator.count++;
        }
      });
      return accumulator;
    },
    { totalApr: 0, count: 0 }
  );

  const averageApr = count > 0 ? totalApr / count : 0;

  return (
    <Grid item xs={12} sm={6} pr={2.5}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {token.name + " "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {(deposit || "0") + " " + token.name}
              </Box>
            </>
          }
        >
          <ListItemText primary={token.name + " Deposited"} />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 %{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {BigNumber(deposit || "0")
                  .multipliedBy(10 ** 18)
                  .dividedBy(
                    BigNumber(balanceTokens).plus(
                      BigNumber(deposit || "0").multipliedBy(10 ** 18)
                    )
                  )
                  .times(100)
                  .toFormat(2)}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {`0 ${shareToken.symbol} `}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {BigNumber(sharedToken || "0").toFormat(6) +
                  " " +
                  shareToken.symbol}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={strategies[0].reports[0].totalFees + "%"}
        >
          <ListItemText primary="Fee" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            BigNumber(strategies[0].reports[0].results[0].apr).toFormat(2) + "%"
          }
        >
          <ListItemText primary="Estimated APR" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={BigNumber(averageApr).toFormat(2) + "%"}
        >
          <ListItemText primary="Historical APR" />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default DepositVaultInfo;
