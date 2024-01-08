import styled from "styled-components";
import { darken } from "polished";
import { useTranslation } from "react-i18next";
import { NavLink, Link as HistoryLink } from "react-router-dom";

import { ArrowLeft } from "react-feather";
import { RowBetween } from "apps/dex/components/Row";
import Settings from "apps/dex/components/Settings";
import { useDispatch } from "react-redux";
import { AppDispatch } from "apps/dex/state";
import { resetMintState } from "apps/dex/state/mint/actions";
import { FC } from "react";

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.active {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`;

export const SwapPoolTabs = () => {
  const { t } = useTranslation();
  return (
    <Tabs style={{ marginBottom: "20px", display: "none" }}>
      <StyledNavLink id={`swap-nav-link`} to={"/swap"}>
        <>{t("swap")}</>
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={"/swap/pool"}>
        <>{t("pool")}</>
      </StyledNavLink>
    </Tabs>
  );
};

export const FindPoolTabs = () => {
  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <HistoryLink to="/swap/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  );
};

type AddRemoveTabsProps = {
  adding: boolean;
  creating: boolean;
};

export const AddRemoveTabs: FC<AddRemoveTabsProps> = ({ adding, creating }) => {
  // reset states on back
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <HistoryLink
          to="/swap/pool"
          onClick={() => {
            adding && dispatch(resetMintState());
          }}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>
          {creating
            ? "Create a pair"
            : adding
            ? "Add Liquidity"
            : "Remove Liquidity"}
        </ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  );
};
