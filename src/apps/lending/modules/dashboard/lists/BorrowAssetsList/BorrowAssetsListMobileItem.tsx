import { Trans } from "@lingui/macro";
import { Box, Button } from "@mui/material";
import { StableAPYTooltip } from "apps/lending/components/infoTooltips/StableAPYTooltip";
import { VariableAPYTooltip } from "apps/lending/components/infoTooltips/VariableAPYTooltip";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { DashboardReserve } from "apps/lending/utils/dashboardSortUtils";

import { CapsHint } from "apps/lending/components/caps/CapsHint";
import { CapType } from "apps/lending/components/caps/helper";
import { IncentivesCard } from "apps/lending/components/incentives/IncentivesCard";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { Row } from "apps/lending/components/primitives/Row";
import { useModalContext } from "apps/lending/hooks/useModal";
import { ListMobileItemWrapper } from "apps/lending/modules/dashboard/lists/ListMobileItemWrapper";
import { ListValueRow } from "apps/lending/modules/dashboard/lists/ListValueRow";
import { FC } from "react";

export const BorrowAssetsListMobileItem: FC<DashboardReserve> = ({
  symbol,
  iconSymbol,
  name,
  availableBorrows,
  availableBorrowsInUSD,
  borrowCap,
  totalBorrows,
  variableBorrowRate,
  stableBorrowRate,
  sIncentivesData,
  vIncentivesData,
  underlyingAsset,
  isFreezed,
}) => {
  const { openBorrow } = useModalContext();
  const { currentMarket } = useProtocolDataContext();

  const disableBorrow = isFreezed || Number(availableBorrows) <= 0;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
    >
      <ListValueRow
        title={<Trans>Available to borrow</Trans>}
        value={Number(availableBorrows)}
        subValue={Number(availableBorrowsInUSD)}
        disabled={Number(availableBorrows) === 0}
        capsComponent={
          <CapsHint
            capType={CapType.borrowCap}
            capAmount={borrowCap}
            totalAmount={totalBorrows}
            withoutText
          />
        }
      />

      <Row
        caption={
          <VariableAPYTooltip
            text={<Trans>APY, variable</Trans>}
            key="APY_dash_mob_variable_ type"
            variant="description"
          />
        }
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={Number(variableBorrowRate)}
          incentives={vIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Row
        caption={
          <StableAPYTooltip
            text={<Trans>APY, stable</Trans>}
            key="APY_dash_mob_stable_ type"
            variant="description"
          />
        }
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={Number(stableBorrowRate)}
          incentives={sIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 5,
        }}
      >
        <Button
          disabled={disableBorrow}
          variant="gradient"
          onClick={() =>
            openBorrow(underlyingAsset, currentMarket, name, "dashboard")
          }
          sx={{ mr: 1.5 }}
          fullWidth
        >
          <Trans>Borrow</Trans>
        </Button>
        <Button
          variant="outlined"
          component={Link}
          href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
          fullWidth
        >
          <Trans>Details</Trans>
        </Button>
      </Box>
    </ListMobileItemWrapper>
  );
};