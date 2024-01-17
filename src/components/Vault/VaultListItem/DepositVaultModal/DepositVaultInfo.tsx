import { FC, memo, useMemo } from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, Grid, ListItemText } from "@mui/material";
import { IVault } from "fathom-sdk";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import { formatNumber, formatPercentage } from "utils/format";
import useSharedContext from "context/shared";

type VaultDepositInfoProps = {
  vaultItemData: IVault;
  deposit: string;
  sharedToken: string;
  performanceFee: number;
};

const DepositVaultInfo: FC<VaultDepositInfoProps> = ({
  vaultItemData,
  deposit,
  sharedToken,
  performanceFee,
}) => {
  const { token, shareToken, strategies, sharesSupply } = vaultItemData;
  const { isMobile } = useSharedContext();

  const { totalApr, count } = useMemo(
    () =>
      strategies[0].reports.reduce(
        (
          accumulator: { totalApr: number; count: number },
          // TODO: type for strategyReport and in ManageVaultInfo component
          strategyReport: any
        ) => {
          strategyReport.results.forEach((result: any) => {
            if (result.apr) {
              accumulator.totalApr += parseFloat(result.apr);
              accumulator.count++;
            }
          });
          return accumulator;
        },
        { totalApr: 0, count: 0 }
      ),
    [strategies]
  );

  const averageApr = count > 0 ? totalApr / count : 0;

  return (
    <Grid item xs={12} sm={6} pr={isMobile ? 0 : 2.5}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {token.name + " "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {formatPercentage(BigNumber(deposit || "0").toNumber()) +
                  " " +
                  token.name}
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
                {BigNumber(sharedToken).isGreaterThan(0) ||
                BigNumber(sharesSupply).isGreaterThan(0)
                  ? formatNumber(
                      BigNumber(sharedToken || "0")
                        .multipliedBy(10 ** 18)
                        .dividedBy(
                          BigNumber(sharesSupply).plus(
                            BigNumber(sharedToken || "0").multipliedBy(10 ** 18)
                          )
                        )
                        .times(100)
                        .toNumber()
                    )
                  : "0"}{" "}
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
                {formatPercentage(BigNumber(sharedToken || "0").toNumber()) +
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
          secondaryAction={
            formatPercentage(BigNumber(performanceFee).toNumber()) + "%"
          }
        >
          <ListItemText primary="Fee" />
        </AppListItem>
        <Divider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            formatNumber(
              BigNumber(strategies[0].reports[0].results[0].apr).toNumber()
            ) + "%"
          }
        >
          <ListItemText primary="Estimated APR" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={formatNumber(BigNumber(averageApr).toNumber()) + "%"}
        >
          <ListItemText primary="Historical APR" />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default memo(DepositVaultInfo);
