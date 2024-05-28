import { FC, memo, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Box, Typography, styled } from "@mui/material";
import { IVaultStrategy, IVaultStrategyReport } from "fathom-sdk";
import { formatNumber } from "utils/format";
import { getAccountUrl } from "utils/explorer";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import {
  DescriptionList,
  strategyDescription,
  strategyTitle,
} from "utils/getStrategyTitleAndDescription";
import { getApr } from "hooks/useApr";
import { IVaultStrategyHistoricalApr } from "hooks/useVaultListItem";
import VaultHistoryChart, {
  HistoryChartDataType,
} from "components/Vaults/VaultDetail/VaultHistoryChart";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";

dayjs.extend(relativeTime);

export const VaultStrategyTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 12px;
`;
export const VaultStrategyDescription = styled(Box)`
  font-size: 14px;
  font-weight: 400;
  color: #b7c8e5;
  padding-bottom: 20px;
  p {
    margin: 0;
  }
  b {
    display: inline-block;
    margin-top: 8px;
  }
`;

export const VaultIndicatorItemWrapper = styled(Box)`
  flex-direction: column;
  flex-grow: 1;
`;

export const VaultIndicatorItemValue = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  text-align: left;
`;

type VaultIndicatorItemPropsType = {
  title: string;
  value: string | number;
  units: string;
  sx?: object;
};

type VaultStrategyItemPropsType = {
  reports: IVaultStrategyReport[];
  historicalApr: IVaultStrategyHistoricalApr[];
  strategyData: IVaultStrategy;
  vaultBalanceTokens: string;
  tokenName: string;
  performanceFee: number;
  index: number;
  vaultId: string;
  isShow: boolean;
};

const VaultIndicatorItem: FC<VaultIndicatorItemPropsType> = memo(
  ({ title, value, units, sx }) => {
    return (
      <VaultIndicatorItemWrapper sx={sx}>
        <Typography fontSize="14px" color={"#6D86B2"} fontWeight={600} pb="4px">
          {title}
        </Typography>
        <VaultIndicatorItemValue>{value + units}</VaultIndicatorItemValue>
      </VaultIndicatorItemWrapper>
    );
  }
);

const VaultStrategyItem: FC<VaultStrategyItemPropsType> = ({
  strategyData,
  vaultBalanceTokens,
  tokenName,
  performanceFee,
  index,
  vaultId,
  reports,
  historicalApr,
  isShow,
}) => {
  const [aprHistoryArr, setAprHistoryArr] = useState<HistoryChartDataType[]>(
    []
  );
  const [lastReportDate, setLastReportDate] = useState<string>("");
  const [allocationShare, setAllocationShare] = useState<number>(0);

  useEffect(() => {
    if (!historicalApr.length || !reports.length) return;

    const extractedData = reports
      .map((reportsItem, index) => {
        return {
          timestamp: reportsItem.timestamp,
          chartValue: getApr(
            reportsItem.currentDebt,
            vaultId,
            historicalApr[index]?.apr
          ),
        };
      })
      .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

    if (reports.length) {
      const lastReport = dayjs(parseInt(reports[0].timestamp, 10)).fromNow();

      setLastReportDate(lastReport);
    }

    setAprHistoryArr(extractedData);
  }, [historicalApr, reports, vaultId]);

  useEffect(() => {
    const allocation =
      vaultBalanceTokens !== "0"
        ? BigNumber(strategyData.currentDebt)
            .dividedBy(BigNumber(vaultBalanceTokens).dividedBy(100))
            .toNumber()
        : 0;

    setAllocationShare(allocation);
  }, [strategyData, vaultBalanceTokens]);

  const totalGain = useMemo(
    () =>
      reports.reduce((acc: BigNumber, report: IVaultStrategyReport) => {
        return acc.plus(report.gain);
      }, BigNumber(0)),
    [reports]
  );

  return (
    <Box sx={{ display: isShow ? "block" : "none" }}>
      <VaultStrategyTitle>
        {strategyTitle[strategyData.id.toLowerCase()] ? (
          strategyTitle[strategyData.id.toLowerCase()]
        ) : (
          <>FXD: Direct Incentive - Educational Strategy {index + 1}</>
        )}
      </VaultStrategyTitle>
      <Link
        to={getAccountUrl(strategyData.id, DEFAULT_CHAIN_ID)}
        target="_blank"
        style={{
          display: "inline-flex",
          fontSize: "14px",
          color: "#B7C8E5",
          textDecoration: "underline",
          marginBottom: "16px",
        }}
      >
        {strategyData.id}
      </Link>
      <VaultStrategyDescription>
        {strategyDescription[strategyData.id.toLowerCase()] ? (
          strategyDescription[strategyData.id.toLowerCase()]
        ) : (
          <>
            <p>
              The strategy enhances returns for FXD Vault investors by ensuring
              continuous earnings. Here's what makes it stand out:
            </p>
            <DescriptionList>
              <li>
                Consistent Earnings: Our approach guarantees a steady flow of
                returns to Vault participants, boosting investment outcomes and
                securing the Vault's growth.
              </li>
              <li>
                Transparency and Security: Trust is key. We share detailed
                performance and earnings reports, keeping operations transparent
                and secure.
              </li>
              <li>
                Educational: Designed to give returns as direct incentivization,
                the strategy reduces participants' risk and doesn't suffer from
                market fluctuations.
              </li>
            </DescriptionList>
          </>
        )}
      </VaultStrategyDescription>
      {lastReportDate && (
        <Typography fontSize="16px">{`Last report ${lastReportDate}.`}</Typography>
      )}
      <AppFlexBox pt="24px">
        <VaultIndicatorItem
          title="Capital Allocation"
          value={`${formatNumber(
            BigNumber(strategyData.currentDebt)
              .dividedBy(10 ** 18)
              .toNumber()
          )}`}
          units={` ${tokenName}`}
        />
        <VaultIndicatorItem
          title="Total Gain"
          value={formatNumber(totalGain.dividedBy(10 ** 18).toNumber())}
          units={` ${tokenName}`}
        />
        <VaultIndicatorItem
          title="APY"
          value={formatNumber(
            Number(getApr(strategyData.currentDebt, vaultId, strategyData.apr))
          )}
          units="%"
        />
        <VaultIndicatorItem
          title="Allocation"
          value={formatNumber(allocationShare)}
          units="%"
        />
        <VaultIndicatorItem
          title="Perfomance fee"
          value={formatNumber(performanceFee)}
          units="%"
        />
      </AppFlexBox>
      <Box width={"100%"}>
        <VaultHistoryChart
          title={"Historical APY"}
          chartDataArray={aprHistoryArr}
          valueLabel="APR"
          valueUnits="%"
        />
      </Box>
    </Box>
  );
};

export default memo(VaultStrategyItem);
