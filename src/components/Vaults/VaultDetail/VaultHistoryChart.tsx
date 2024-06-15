import { FC, memo, useEffect, useRef, useState } from "react";
import { Box, ListItemText, Paper, Typography, styled } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "utils/format";
import useSharedContext from "context/shared";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import dayjs from "dayjs";

export const ChartWrapper = styled(Box)`
  position: relative;
  display: block;
  width: 100%;
  height: fit-content;
  padding-top: 25px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding-top: 0;
  }
`;

export const ChartTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  margin-bottom: 16px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

const CustomTooltipPaper = styled(Paper)`
  border-radius: 8px;
  background: #2a3e5a;
  box-shadow: 0 12px 32px 0 rgba(0, 7, 21, 0.5);
  padding: 10px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 5px 5px 5px 10px;
  }
  .MuiListItem-root {
    > * {
      color: #fff;
    }
  }
`;

const AppListTooltip = styled(AppList)`
  padding: 0;
  & .MuiListItem-root {
    justify-content: space-between;
    gap: 50px;
    padding: 2px 0;

    & .MuiListItemText-root {
      margin: 0;
      span {
        font-size: 11px;
        font-weight: 400;
        color: #b7c8e5;
      }
    }

    & .MuiListItemSecondaryAction-root {
      color: #fff;
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

export interface HistoryChartDataType {
  timestamp: string;
  chartValue: string;
}

type VaultHistoryChartPropTypes = {
  title: string;
  chartDataArray: HistoryChartDataType[];
  valueLabel: string;
  valueUnits?: string;
};

interface CustomizedYAxisTickProps {
  x: number;
  y: number;
  stroke?: string;
  payload: { value: number };
}

const CustomTooltip: FC<TooltipProps<ValueType, NameType>> = memo(
  ({ payload }) => {
    if (payload && payload.length) {
      const reportTimestamp = parseInt(payload[0]?.payload?.timestamp, 10);
      const reportDateString = dayjs(reportTimestamp).format(
        "DD.MM.YYYY HH:mm:ss"
      );
      const units = payload[0].unit || "";
      return (
        <CustomTooltipPaper>
          <AppListTooltip>
            <AppListItem secondaryAction={reportDateString}>
              <ListItemText primary={"Date"} />
            </AppListItem>
            <AppListItem
              secondaryAction={
                <>{`${formatNumber(payload[0].payload?.chartValue) + units}`}</>
              }
            >
              <ListItemText primary={payload[0].name} />
            </AppListItem>
          </AppListTooltip>
        </CustomTooltipPaper>
      );
    }

    return null;
  }
);

const CustomizedYAxisTick: FC<CustomizedYAxisTickProps> = ({
  x,
  y,
  payload,
}) => {
  return (
    <g transform={`translate(${x},${y - 10})`}>
      <text x={0} y={0} dy={16} textAnchor="start" fill="#6D86B2" fontSize={11}>
        {formatNumber(payload.value)}
      </text>
    </g>
  );
};

const VaultHistoryChart: FC<VaultHistoryChartPropTypes> = ({
  title,
  chartDataArray,
  valueLabel,
  valueUnits,
}) => {
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);

  const { isMobile } = useSharedContext();
  const counter = useRef(0);

  useEffect(() => {
    if (chartDataArray.length) {
      counter.current = 0;
    }
  }, [chartDataArray]);

  useEffect(() => {
    if (chartDataArray.length) {
      const chartValues: number[] = [];
      const valuesLength: number[] = [];

      chartDataArray.forEach((item) => {
        /**
         * Chart values for Y axis
         */
        const chartValue = parseFloat(item.chartValue || "0");
        chartValues.push(chartValue);
        valuesLength.push(formatNumber(chartValue).length);
      });

      setMaxValue(Math.max(...chartValues));
      setMinValue(Math.min(...chartValues));

      const maxLength = Math.max(...valuesLength);
      let multiplier = maxLength / 3;
      multiplier = multiplier < 1 ? 1 : multiplier;
      setMultiplier(multiplier);
    } else {
      setMaxValue(0);
      setMinValue(0);
      setMultiplier(1);
    }
  }, [chartDataArray, setMultiplier, setMaxValue, setMinValue]);

  // @ts-ignore
  const tickFormatter = (timestamp: string, index: number) => {
    const date = dayjs(Number(timestamp));
    let returnValue =
      date.month() === 0 ? date.format("YYYY") : date.format("DD/MMM");

    if (chartDataArray.length > 100) {
      returnValue =
        counter.current % 10 === 0
          ? date.month() === 0
            ? date.format("YYYY")
            : date.format("DD/MMM")
          : "";
    }

    counter.current = counter.current + 1;

    console.log({
      returnValue,
      counter: counter.current,
    });

    return returnValue;
  };

  const containerProps = {
    width: "100%",
    aspect: 6,
  };

  if (isMobile) {
    containerProps["aspect"] = 2.1;
  }

  return (
    <ChartWrapper>
      <ChartTitle>{title}</ChartTitle>
      <ResponsiveContainer {...containerProps}>
        <LineChart
          data={chartDataArray}
          margin={{
            top: 0,
            right: formatNumber(maxValue).length * multiplier,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="#3D5580"
            strokeDasharray="5 5"
            vertical={false}
          />
          <XAxis
            domain={["auto", "auto"]}
            dataKey="timestamp"
            stroke="#5977a0"
            tick={{ fontSize: 11, fill: "#5977a0" }}
            tickFormatter={tickFormatter}
            allowDataOverflow={true}
            strokeWidth={1}
          />
          <YAxis
            domain={[minValue, maxValue]}
            stroke={"transparent"}
            orientation="right"
            tick={(props) => <CustomizedYAxisTick {...props} />}
            allowDataOverflow={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="step"
            dataKey="chartValue"
            stroke="#00fff6"
            strokeWidth={2}
            name={valueLabel}
            unit={valueUnits}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default memo(VaultHistoryChart);
