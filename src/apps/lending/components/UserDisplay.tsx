import { Box } from "@mui/material";
import { blo } from "blo";
import { FC, useMemo } from "react";
import { useRootStore } from "apps/lending/store/root";
import shallow from "zustand/shallow";

import { Avatar, AvatarProps } from "apps/lending/components/Avatar";
import {
  BadgeSize,
  ExclamationBadge,
} from "apps/lending/components/badges/ExclamationBadge";
import {
  UserNameText,
  UserNameTextProps,
} from "apps/lending/components/UserNameText";

type UserDisplayProps = {
  oneLiner?: boolean;
  avatarProps?: AvatarProps;
  titleProps?: Omit<UserNameTextProps, "address" | "domainName">;
  subtitleProps?: Omit<UserNameTextProps, "address" | "domainName">;
  withLink?: boolean;
  funnel?: string;
};

export const UserDisplay: FC<UserDisplayProps> = ({
  oneLiner = false,
  avatarProps,
  titleProps,
  subtitleProps,
  withLink,
  funnel,
}) => {
  const { account, defaultDomain, domainsLoading, accountLoading } =
    useRootStore(
      (state) => ({
        account: state.account,
        defaultDomain: state.defaultDomain,
        domainsLoading: state.domainsLoading,
        accountLoading: state.accountLoading,
      }),
      shallow
    );
  const fallbackImage = useMemo(
    () => (account ? blo(account as `0x${string}`) : undefined),
    [account]
  );
  const loading = domainsLoading || accountLoading;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar
        fallbackImage={fallbackImage}
        loading={loading}
        badge={<ExclamationBadge size={BadgeSize.SM} />}
        invisibleBadge
        {...avatarProps}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {!oneLiner && defaultDomain?.name ? (
          <>
            <UserNameText
              address={account}
              loading={loading}
              domainName={defaultDomain.name}
              variant="h4"
              link={
                withLink ? `https://etherscan.io/address/${account}` : undefined
              }
              funnel={funnel}
              {...titleProps}
            />
            <UserNameText
              address={account}
              loading={loading}
              variant="caption"
              {...subtitleProps}
            />
          </>
        ) : (
          <UserNameText
            address={account}
            domainName={defaultDomain?.name}
            loading={loading}
            variant="h4"
            link={
              withLink ? `https://etherscan.io/address/${account}` : undefined
            }
            funnel={funnel}
            {...titleProps}
          />
        )}
      </Box>
    </Box>
  );
};
