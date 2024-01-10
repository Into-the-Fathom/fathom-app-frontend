import { Trans } from "@lingui/macro";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

export const TotalBorrowAPYTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        The weighted average of APY for all borrowed assets, including
        incentives.
      </Trans>
    </TextWithTooltip>
  );
};
