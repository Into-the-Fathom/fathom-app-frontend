import { ExclamationIcon } from "@heroicons/react/outline";
import { Box, SvgIcon } from "@mui/material";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";
import { AMPLWarning } from "apps/lending/components/Warnings/AMPLWarning";

export const AMPLToolTip = () => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <AMPLWarning />
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: "20px", color: "warning.main", ml: 2 }}>
        <ExclamationIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
