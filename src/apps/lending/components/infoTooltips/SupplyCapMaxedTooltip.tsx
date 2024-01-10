import { ExclamationIcon } from "@heroicons/react/outline";
import { Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";

import { Link } from "apps/lending/components/primitives/Link";
import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

type SupplyCapMaxedTooltipProps = TextWithTooltipProps & {
  supplyCap: AssetCapData;
};

export const SupplyCapMaxedTooltip = ({
  supplyCap,
  ...rest
}: SupplyCapMaxedTooltipProps) => {
  if (!supplyCap || !supplyCap.isMaxed) return null;

  return (
    <Box sx={{ ml: 2 }}>
      <TextWithTooltip
        {...rest}
        icon={<ExclamationIcon />}
        iconColor="warning.main"
        iconSize={18}
      >
        <>
          <Trans>
            Protocol supply cap at 100% for this asset. Further supply
            unavailable.
          </Trans>{" "}
          <Link
            href="https://docs.aave.com/developers/whats-new/supply-borrow-caps"
            underline="always"
          >
            <Trans>Learn more</Trans>
          </Link>
        </>
      </TextWithTooltip>
    </Box>
  );
};
