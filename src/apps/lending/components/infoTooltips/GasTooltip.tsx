import { Trans } from "@lingui/macro";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";

export const GasTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip
      event={{
        eventName: GENERAL.TOOL_TIP,
        eventParams: { tooltip: "Gas Calc" },
      }}
      {...rest}
    >
      <Trans>
        This gas calculation is only an estimation. Your wallet will set the
        price of the transaction. You can modify the gas settings directly from
        your wallet provider.
      </Trans>
    </TextWithTooltip>
  );
};