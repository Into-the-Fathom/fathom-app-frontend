import { CheckIcon } from "@heroicons/react/outline";
import { Box, SvgIcon } from "@mui/material";

import { NoData } from "apps/lending/components/primitives/NoData";
import { ListItemIsolationBadge } from "apps/lending/modules/dashboard/lists/ListItemIsolationBadge";
import { FC, memo } from "react";

interface ListItemCanBeCollateralProps {
  isIsolated: boolean;
  usageAsCollateralEnabled: boolean;
}

export const ListItemCanBeCollateral: FC<ListItemCanBeCollateralProps> = memo(
  ({ isIsolated, usageAsCollateralEnabled }) => {
    const CollateralStates = () => {
      if (usageAsCollateralEnabled && !isIsolated) {
        return (
          <SvgIcon
            sx={{
              color: "success.main",
              fontSize: { xs: "20px", xsm: "24px" },
            }}
          >
            <CheckIcon />
          </SvgIcon>
        );
      } else if (usageAsCollateralEnabled && isIsolated) {
        // NOTE: handled in ListItemIsolationBadge
        return null;
      } else {
        return <NoData variant="main14" color="text.secondary" />;
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isIsolated ? (
          <CollateralStates />
        ) : (
          <ListItemIsolationBadge>
            <CollateralStates />
          </ListItemIsolationBadge>
        )}
      </Box>
    );
  }
);
