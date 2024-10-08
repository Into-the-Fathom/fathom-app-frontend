import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, SvgIcon } from "@mui/material";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Row } from "apps/lending/components/primitives/Row";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import {
  CollateralState,
  DetailsHFLine,
  DetailsIncentivesLine,
  DetailsNumberLine,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { CollateralType } from "apps/lending/helpers/types";

import { ComputedUserReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export type SupplyModalDetailsProps = {
  showHealthFactor: boolean;
  healthFactor: string;
  healthFactorAfterSwap: string;
  swapSource: ComputedUserReserveData & { collateralType: CollateralType };
  swapTarget: ComputedUserReserveData & { collateralType: CollateralType };
  toAmount: string;
  fromAmount: string;
  loading: boolean;
};

export const SwapModalDetails = ({
  showHealthFactor,
  healthFactor,
  healthFactorAfterSwap,
  swapSource,
  swapTarget,
  toAmount,
  fromAmount,
  loading,
}: SupplyModalDetailsProps) => {
  const sourceAmountAfterSwap = valueToBigNumber(
    swapSource.underlyingBalance
  ).minus(valueToBigNumber(fromAmount));

  const targetAmountAfterSwap = valueToBigNumber(
    swapTarget.underlyingBalance
  ).plus(valueToBigNumber(toAmount));

  const skeleton: JSX.Element = (
    <>
      <CustomSkeleton
        variant="rectangular"
        height={20}
        width={100}
        sx={{ borderRadius: "4px" }}
        animation={"wave"}
      />
      <CustomSkeleton
        variant="rectangular"
        height={15}
        width={80}
        sx={{ borderRadius: "4px", marginTop: "4px" }}
        animation={"wave"}
      />
    </>
  );

  return (
    <>
      {healthFactorAfterSwap && (
        <DetailsHFLine
          healthFactor={healthFactor}
          futureHealthFactor={healthFactorAfterSwap}
          visibleHfChange={showHealthFactor}
          loading={loading}
        />
      )}
      <DetailsNumberLine
        description={<>Supply apy</>}
        value={swapSource.reserve.supplyAPY}
        futureValue={swapTarget.reserve.supplyAPY}
        percent
        loading={loading}
      />
      <Row caption={<>Collateralization</>} captionVariant="description" mb={4}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {loading ? (
            <CustomSkeleton
              variant="rectangular"
              height={20}
              width={100}
              sx={{ borderRadius: "4px" }}
              animation={"wave"}
            />
          ) : (
            <>
              <CollateralState collateralType={swapSource.collateralType} />

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SvgIcon color="primary" sx={{ fontSize: "14px", mx: 1 }}>
                  <ArrowForwardIcon />
                </SvgIcon>

                <CollateralState collateralType={swapTarget.collateralType} />
              </Box>
            </>
          )}
        </Box>
      </Row>
      <DetailsIncentivesLine
        incentives={swapSource.reserve.fmIncentivesData}
        symbol={swapSource.reserve.symbol}
        futureIncentives={swapTarget.reserve.fmIncentivesData}
        futureSymbol={swapTarget.reserve.symbol}
        loading={loading}
      />
      <DetailsNumberLine
        description={<>Liquidation threshold</>}
        value={swapSource.reserve.formattedReserveLiquidationThreshold}
        futureValue={swapTarget.reserve.formattedReserveLiquidationThreshold}
        percent
        visibleDecimals={0}
        loading={loading}
      />

      <Row
        caption={<>Supply balance after switch</>}
        captionVariant="description"
        mb={4}
        align="flex-start"
      >
        <Box sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {loading ? (
              skeleton
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TokenIcon
                    symbol={swapSource.reserve.iconSymbol}
                    sx={{ mr: 2, ml: 4, fontSize: "16px" }}
                  />
                  <FormattedNumber
                    value={sourceAmountAfterSwap.toString()}
                    variant="secondary14"
                    compact
                  />
                </Box>
                <FormattedNumber
                  value={sourceAmountAfterSwap
                    .multipliedBy(
                      valueToBigNumber(swapSource.reserve.priceInUSD)
                    )
                    .toString()}
                  variant="helperText"
                  compact
                  symbol="USD"
                  symbolsColor="text.secondary"
                  color="text.secondary"
                />
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            mt={2}
          >
            {loading ? (
              skeleton
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TokenIcon
                    symbol={swapTarget.reserve.iconSymbol}
                    sx={{ mr: 2, ml: 4, fontSize: "16px" }}
                  />
                  <FormattedNumber
                    value={targetAmountAfterSwap.toString()}
                    variant="secondary14"
                    compact
                  />
                </Box>
                <FormattedNumber
                  value={targetAmountAfterSwap
                    .multipliedBy(
                      valueToBigNumber(swapTarget.reserve.priceInUSD)
                    )
                    .toString()}
                  variant="helperText"
                  compact
                  symbol="USD"
                  symbolsColor="text.secondary"
                  color="text.secondary"
                />
              </>
            )}
          </Box>
        </Box>
      </Row>
    </>
  );
};
