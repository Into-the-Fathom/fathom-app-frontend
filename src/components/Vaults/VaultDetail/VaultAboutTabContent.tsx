import { Link } from "react-router-dom";
import BigNumber from "bignumber.js";
import { Box, ListItemText, Typography } from "@mui/material";
import {
  VaultAboutTitle,
  vaultDescription,
} from "utils/getVaultTitleAndDescription";
import { getAccountUrl } from "utils/explorer";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import useVaultContext from "context/vault";
import { useAprNumber } from "hooks/Vaults/useApr";
import { formatNumber, formatPercentage } from "utils/format";
import { AppListItem } from "components/AppComponents/AppList/AppList";
import {
  AppListApy,
  AppListFees,
  VaultContractAddress,
  VaultDescriptionWrapper,
} from "components/Vaults/VaultDetail/VaultDetailInfoTabAbout";

const VaultAboutTabContent = () => {
  const { vault, performanceFee, protocolFee } = useVaultContext();
  const aprNumber = useAprNumber(vault);
  return (
    <>
      <VaultDescriptionWrapper>
        {vaultDescription[vault.id.toLowerCase()] ? (
          vaultDescription[vault.id.toLowerCase()]
        ) : (
          <>
            <VaultAboutTitle variant={"h5"}>Description</VaultAboutTitle>
            <Typography component={"span"}>
              The FXD vault functions as a pool of funds with an
              auto-compounding strategy that manages and executes various tasks
              based on predefined conditions. Users can deposit FXD only into
              this vault, which then uses algorithms to perform actions such as
              yield farming: lending, borrowing, etc. The FXD can consist of
              different strategies, all separately investable. Each strategy
              investment returns a strategy share token. Note that this is a
              share token and so not 1:1 equivalent with FXD deposited. The FXD
              vault only charges performance fees when strategy tokens are
              redeemed. There is no management fee. Note that the vault
              strategies have been carefully audited, nevertheless users are -
              as always in defi - exposed to smart contract risk.
            </Typography>
          </>
        )}
      </VaultDescriptionWrapper>
      <VaultContractAddress>
        Vault contract address:{" "}
        <Link to={getAccountUrl(vault.id, DEFAULT_CHAIN_ID)} target="_blank">
          {vault.id}
        </Link>
      </VaultContractAddress>
      <Box>
        <VaultAboutTitle variant={"h5"} sx={{ marginBottom: 0 }}>
          APY
        </VaultAboutTitle>
        <Box width={"100%"}>
          <AppListApy>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(52).toNumber())}%
                </>
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Weekly APY"} />
            </AppListItem>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={
                <>
                  {formatNumber(BigNumber(aprNumber).dividedBy(12).toNumber())}%
                </>
              }
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Monthly APY"} />
            </AppListItem>
            <AppListItem
              alignItems="flex-start"
              secondaryAction={<>{formatNumber(aprNumber)}%</>}
              sx={{ padding: "0 !important" }}
            >
              <ListItemText primary={"Yearly APY"} />
            </AppListItem>
          </AppListApy>
        </Box>
      </Box>
      <Box>
        <VaultAboutTitle sx={{ marginBottom: 0 }}>Fees</VaultAboutTitle>
        <AppListFees>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>{`${formatPercentage(
                Number(performanceFee * (protocolFee / 100))
              )}%`}</>
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText primary={"Protocol fee"} />
          </AppListItem>
          <AppListItem
            alignItems="flex-start"
            secondaryAction={
              <>{`${formatPercentage(Number(performanceFee))}%`}</>
            }
            sx={{ padding: "0 !important" }}
          >
            <ListItemText primary={"Total fee"} />
          </AppListItem>
        </AppListFees>
      </Box>
    </>
  );
};

export default VaultAboutTabContent;