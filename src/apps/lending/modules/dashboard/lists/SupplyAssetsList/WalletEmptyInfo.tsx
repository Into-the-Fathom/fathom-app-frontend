import { ChainId } from "@aave/contract-helpers";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { Warning } from "apps/lending/components/primitives/Warning";
import { useRootStore } from "apps/lending/store/root";
import { NetworkConfig } from "apps/lending/ui-config/networksConfig";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { Link } from "apps/lending/components/primitives/Link";

type WalletEmptyInfoProps = Pick<NetworkConfig, "bridge" | "name"> & {
  chainId: number;
  icon?: boolean;
  sx?: SxProps<Theme>;
};

export function WalletEmptyInfo({
  bridge,
  name,
  chainId,
  icon,
  sx,
}: WalletEmptyInfoProps) {
  const network = [ChainId.avalanche].includes(chainId)
    ? "Ethereum & Bitcoin"
    : "Ethereum";

  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Warning severity="info" icon={icon} sx={sx}>
      {bridge ? (
        <Trans>
          Your {name} wallet is empty. Purchase or transfer assets or use{" "}
          {
            <Link
              onClick={() => {
                trackEvent(GENERAL.EXTERNAL_LINK, {
                  bridge: bridge.name,
                  Link: "Bridge Link",
                });
              }}
              href={bridge.url}
            >
              {bridge.name}
            </Link>
          }{" "}
          to transfer your {network} assets.
        </Trans>
      ) : (
        <Trans>Your {name} wallet is empty. Purchase or transfer assets.</Trans>
      )}
    </Warning>
  );
}
