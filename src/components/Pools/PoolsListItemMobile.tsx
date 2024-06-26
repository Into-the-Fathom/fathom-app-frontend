import { Dispatch, FC, SetStateAction, memo } from "react";
import { ICollateralPool } from "fathom-sdk";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import BigNumber from "bignumber.js";
import usePricesContext from "context/prices";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber } from "utils/format";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import PriceChanged from "components/Common/PriceChange";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { OpenPositionButton } from "components/AppComponents/AppButton/AppButton";
import PoolName from "components/Pools/PoolListItem/PoolName";

type PoolsListItemMobilePropsType = {
  pool: ICollateralPool;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
};

const PoolsListItemMobileContainer = styled(Box)`
  width: 100%;
  background: #131f35;
  border-bottom: 1px solid #131f35;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 10px;
`;

const ListItemWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ListLabel = styled(Box)`
  color: #6379a1;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: start;
`;

const ListValue = styled(Box)`
  display: flex;
  justify-content: right;
  align-items: center;
  flex-direction: row;
  gap: 7px;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.column {
    flex-direction: column;
    align-items: end;
  }
`;

const PoolWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;

const OpenPositionButtonMobile = styled(OpenPositionButton)`
  height: 36px;
  width: 100%;
  margin-top: 20px;
`;

const PoolsListItemMobile: FC<PoolsListItemMobilePropsType> = ({
  pool,
  setSelectedPool,
}) => {
  const { xdcPrice, prevXdcPrice } = usePricesContext();
  return (
    <PoolsListItemMobileContainer>
      <ListItemWrapper>
        <ListLabel>Pool</ListLabel>
        <ListValue className={"column"}>
          <PoolWrapper>
            <img
              src={getTokenLogoURL(
                pool?.poolName?.toUpperCase() === "XDC" ? "WXDC" : pool.poolName
              )}
              alt={pool.poolName}
              width={20}
              height={20}
            />
            <PoolName>{pool.poolName}</PoolName>
          </PoolWrapper>
          <TVL sx={{ textAlign: "right" }}>
            TVL: {formatCurrency(Number(pool.tvl))}
          </TVL>
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Price</ListLabel>
        <ListValue>
          {formatCurrency(
            pool.poolName.toUpperCase() === "XDC" &&
              BigNumber(xdcPrice).isGreaterThan(0)
              ? BigNumber(xdcPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              : pool.collateralPrice
          )}
          <PriceChanged
            current={
              pool.poolName.toUpperCase() === "XDC" &&
              BigNumber(xdcPrice).isGreaterThan(0)
                ? BigNumber(xdcPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                : Number(pool.collateralPrice)
            }
            previous={
              pool.poolName.toUpperCase() === "XDC" &&
              prevXdcPrice &&
              BigNumber(prevXdcPrice).isGreaterThan(0)
                ? BigNumber(prevXdcPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                : Number(pool.collateralLastPrice)
            }
          />
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Borrowed</ListLabel>
        <ListValue>{formatNumber(Number(pool.totalBorrowed))} FXD</ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Available</ListLabel>
        <ListValue>{formatNumber(Number(pool.totalAvailable))} FXD</ListValue>
      </ListItemWrapper>
      <OpenPositionButtonMobile onClick={() => setSelectedPool(pool)}>
        <AddCircleIcon sx={{ fontSize: "20px", marginRight: "7px" }} />
        Open Position
      </OpenPositionButtonMobile>
    </PoolsListItemMobileContainer>
  );
};

export default memo(PoolsListItemMobile);
