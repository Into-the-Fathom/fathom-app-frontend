import { Trans } from "@lingui/macro";
import type { Theme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { AssetCapHookData } from "apps/lending/hooks/useAssetCaps";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Link } from "apps/lending/components/primitives/Link";
import { TextWithTooltip } from "apps/lending/components/TextWithTooltip";

type DebtCeilingTooltipProps = {
  debt: string;
  ceiling: string;
  usageData: AssetCapHookData;
};

export const DebtCeilingStatus = ({
  debt,
  ceiling,
  usageData,
}: LinearProgressProps & DebtCeilingTooltipProps) => {
  const progressBarStyles = {
    borderRadius: 5,
    my: 2,
    height: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: (theme: Theme) => theme.palette.other.fathomAccentMute,
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: (theme: Theme) => theme.palette.other.fathomAccent,
    },
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography color="text.secondary" component="span">
            <Trans>Isolated Debt Ceiling</Trans>
          </Typography>
          <TextWithTooltip>
            <>
              <Trans>
                Debt ceiling limits the amount possible to borrow against this
                asset by protocol users. Debt ceiling is specific to assets in
                isolation mode and is denoted in USD.
              </Trans>{" "}
              <Link
                href="https://docs.aave.com/faq/aave-v3-features#how-does-isolation-mode-affect-my-borrowing-power"
                underline="always"
              >
                <Trans>Learn more</Trans>
              </Link>
            </>
          </TextWithTooltip>
        </Box>
        <Box>
          <FormattedNumber
            value={debt}
            variant="main14"
            symbol="USD"
            symbolsVariant="secondary14"
            visibleDecimals={2}
          />
          <Typography
            component="span"
            color="text.secondary"
            variant="secondary14"
            sx={{ display: "inline-block", mx: 1 }}
          >
            <Trans>of</Trans>
          </Typography>
          <FormattedNumber
            value={ceiling}
            variant="main14"
            symbol="USD"
            symbolsVariant="secondary14"
            visibleDecimals={2}
          />
        </Box>
      </Box>
      <LinearProgress
        sx={progressBarStyles}
        variant="determinate"
        // We show at minimum, 1% color to represent small values
        value={usageData.percentUsed <= 1 ? 1 : usageData.percentUsed}
      />
    </>
  );
};