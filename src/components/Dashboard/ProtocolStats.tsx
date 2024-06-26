import { Grid, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useProtocolStats from "hooks/General/useProtocolStats";
import { formatCurrency, formatNumber } from "utils/format";
import usePricesContext from "context/prices";
import useSharedContext from "context/shared";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import BigNumber from "bignumber.js";
import { StatsValueSkeleton } from "components/AppComponents/AppSkeleton/AppSkeleton";

const StatsItem = styled(Grid)`
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: calc(33.33% - 8px);
  background: #131f35;
  border-radius: 8px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 16px 20px;
    justify-content: start;
  }
`;

const ProtocolStatsContainer = styled(Grid)`
  margin-bottom: 30px;
  display: flex;
  gap: 8px;
  height: 100%;
`;

const StatsTitle = styled(
  Typography,
  {}
)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "13px",
  lineHeight: "19px",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  gap: "7px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "left",
  },
}));

const StatsValue = styled(Typography)`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  margin: 0;
  padding: 12px 0 0 0;
  text-align: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    text-align: left;
    padding: 0;
  }
`;

const ProtocolStats = () => {
  const { tvl, loading, poolsLoading, totalBorrowed } = useProtocolStats();
  const { fxdPrice, fetchPricesInProgress } = usePricesContext();
  const { isMobile } = useSharedContext();

  return (
    <ProtocolStatsContainer container>
      <StatsItem item>
        <Box>
          <StatsTitle>
            Total Issued
            <AppPopover
              id={"total-issued"}
              text={
                "The total amount of FXD has been issued through borrowing from protocol and is currently in circulation."
              }
            />
          </StatsTitle>
          {poolsLoading ? (
            <StatsValueSkeleton isMobile={isMobile} />
          ) : (
            <StatsValue variant={"body2"}>
              {formatNumber(totalBorrowed) + " FXD"}
            </StatsValue>
          )}
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>
            TVL
            <AppPopover
              id={"tvl"}
              text={
                "TVL, or Total Value Locked, signifies the total amount of assets currently deposited in the platform and used to borrow FXD."
              }
            />
          </StatsTitle>
          {loading ? (
            <StatsValueSkeleton isMobile={isMobile} />
          ) : (
            <StatsValue>{formatCurrency(tvl)}</StatsValue>
          )}
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>FXD Price</StatsTitle>
          {fetchPricesInProgress ? (
            <StatsValueSkeleton isMobile={isMobile} />
          ) : (
            <StatsValue>
              {formatCurrency(
                BigNumber(fxdPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              )}
            </StatsValue>
          )}
        </Box>
      </StatsItem>
    </ProtocolStatsContainer>
  );
};

export default ProtocolStats;
