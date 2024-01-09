import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Polling from "apps/dex/components/Header/Polling";
import Popups from "apps/dex/components/Popups";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 40px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
    padding-top: 2rem;
  `};
`;

const App = () => {
  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Outlet />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
};

export default App;
