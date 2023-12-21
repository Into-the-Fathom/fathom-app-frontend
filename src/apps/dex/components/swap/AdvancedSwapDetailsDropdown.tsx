import styled from "styled-components";
import { useLastTruthy } from "apps/dex/hooks/useLast";
import {
  AdvancedSwapDetails,
  AdvancedSwapDetailsProps,
} from "apps/dex/components/swap/AdvancedSwapDetails";
import { FC } from "react";

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 16px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  z-index: -1;

  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(-100%)")};
  transition: transform 300ms ease-in-out;
`;

const AdvancedSwapDetailsDropdown: FC<AdvancedSwapDetailsProps> = ({
  trade,
  ...rest
}) => {
  const lastTrade = useLastTruthy(trade);

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  );
};

export default AdvancedSwapDetailsDropdown;
