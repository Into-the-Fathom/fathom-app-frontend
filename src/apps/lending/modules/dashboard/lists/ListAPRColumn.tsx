import { ReserveIncentiveResponse } from "@into-the-fathom/lending-math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives";
import { Box } from "@mui/material";
import { ReactNode } from "react";

import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { ListColumn } from "apps/lending/components/lists/ListColumn";

interface ListAPRColumnProps {
  value: number;
  incentives?: ReserveIncentiveResponse[];
  symbol: string;
  tooltip?: ReactNode;
}

export const ListAPRColumn = ({
  value,
  incentives,
  symbol,
  tooltip,
}: ListAPRColumnProps) => {
  return (
    <ListColumn>
      <Box sx={{ display: "flex" }}>
        <IncentivesCard value={value} incentives={incentives} symbol={symbol} />
        {tooltip}
      </Box>
    </ListColumn>
  );
};
