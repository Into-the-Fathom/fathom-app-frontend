import loadable from "@loadable/component";
import { styled, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Menu as MenuIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import truncateEthAddress from "truncate-eth-address";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

const Copyright = loadable(() => import("../Footer/Footer"));
const AppBar = loadable(() => import("../AppComponents/AppBar/AppBar"));
const DashboardContent = loadable(() => import("../Dashboard/Dashboard"));

const StableSwap = loadable(() => import("../Stableswap/StableSwap"));
const StableSwapAddLiquidity = loadable(
  () => import("../Stableswap/StableSwapAddLiquidity")
);
const StableSwapRemoveLiquidity = loadable(
  () => import("../Stableswap/StableSwapRemoveLiquidity")
);
const StableSwapManageFees = loadable(
  () => import("../Stableswap/StableSwapManageFees")
);

const AllVaultView = loadable(() => import("../Vault/AllVaultView"));
const Web3Status = loadable(() => import("../Web3Status/Web3Status"));

const AllProposalsView = loadable(
  () => import("../Governance/ViewAllProposals")
);
const ProposalView = loadable(() => import("../Governance/Proposal"));

const StakingView = loadable(() => import("../Staking/StakingView"));
const AlertMessages = loadable(() => import("../Common/AlertMessages"));
const TransactionStatus = loadable(
  () => import("../Transaction/TransactionStatus")
);

const DaoView = loadable(() => import("../Dashboard/DaoView"));

import { Menu } from "components/Dashboard/Menu";
import { ToggleDrawerButton } from "components/AppComponents/AppButton/AppButton";
import { MainBox } from "components/AppComponents/AppBox/AppBox";
const MobileConnector = loadable(() => import("../Dashboard/MobileConnector"));
const DesktopConnector = loadable(
  () => import("../Dashboard/DesktopConnector")
);
const BottomLinks = loadable(() => import("../Dashboard/BottomLinks"));
const MobileMenu = loadable(() => import("../Dashboard/MobileMenu"));
const DexView = loadable(() => import("../Dashboard/DexView"));
import { drawerWidth } from "components/AppComponents/AppBar/AppBar";
const TransactionErc20TokenModal = loadable(
  () => import("../Transaction/TransactionErc20TokenModal")
);
import { themeObject } from "theme";
const FthmInfoModal = loadable(() => import("../FthmInfo/FthmInfoModal"));

/**
 * DEX
 */
const Swap = loadable(() => import("../../apps/dex/pages/Swap"));
import {
  RedirectPathToSwapOnly,
  RedirectToSwap,
} from "apps/dex/pages/Swap/redirects";
const PoolFinder = loadable(() => import("../../apps/dex/pages/PoolFinder"));
const Pool = loadable(() => import("../../apps/dex/pages/Pool"));
import {
  RedirectOldAddLiquidityPathStructure,
  RedirectDuplicateTokenIds,
} from "apps/dex/pages/AddLiquidity/redirects";
const AddLiquidity = loadable(
  () => import("../../apps/dex/pages/AddLiquidity")
);
import { RedirectOldRemoveLiquidityPathStructure } from "apps/dex/pages/RemoveLiquidity/redirects";
const RemoveLiquidity = loadable(
  () => import("../../apps/dex/pages/RemoveLiquidity")
);
const FathomBalanceContent = loadable(
  () => import("../../apps/dex/components/Header/FathomBalanceContent")
);
import { TYPE } from "apps/dex/theme";
import { CountUp } from "use-count-up";
import { CardNoise } from "apps/dex/components/earn/styled";

import useMainLayout from "hooks/useMainLayout";
import { StakingProvider } from "context/staking";
import { ProposalProvider } from "context/proposal";
import useConnector from "context/connector";
import useAlertAndTransactionContext from "context/alertAndTransaction";

const ChartsView = loadable(() => import("../Dashboard/ChartsView"));

import FathomAppLogoSrc from "assets/svg/Fathom-app-logo.svg";
import ExitSrc from "assets/svg/exit.svg";
import MetamaskSrc from "assets/svg/metamask.svg";
import WalletConnectSrc from "assets/svg/wallet-connect.svg";
import FathomLogoMobileSrc from "assets/svg/Fathom-app-logo-mobile.svg";
import MobileMenuIcon from "assets/svg/mobile-menu.svg";
import MobileMenuIconActive from "assets/svg/mobile-menu-active.svg";
import { formatNumber } from "utils/format";

const GlobalPage = loadable(() => import("../../apps/charts/pages/GlobalPage"));
import { TokenPageRouterComponent } from "apps/charts/pages/TokenPage";
import { PairPageRouterComponent } from "apps/charts/pages/PairPage";
import { AccountPageRouterComponent } from "apps/charts/pages/AccountPage";
const AllTokensPage = loadable(
  () => import("../../apps/charts/pages/AllTokensPage")
);
const AllPairsPage = loadable(
  () => import("../../apps/charts/pages/AllPairsPage")
);
const AccountLookup = loadable(
  () => import("../../apps/charts/pages/AccountLookup")
);
import { LayoutWrapper } from "apps/charts/App";
import {
  useGlobalChartData,
  useGlobalData,
} from "apps/charts/contexts/GlobalData";
import { ApolloProvider } from "@apollo/client";
import { dexClient } from "apollo/client";
import Transactions from "apps/dex/pages/Transactions";
import { memo, useEffect } from "react";
import ReactGA from "react-ga4";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "sticky",
    height: "100vh",
    whiteSpace: "nowrap",
    background: "#101D32",
    border: "none",
    overflowY: "visible",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "visible",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const MenuWrapper = styled("nav")<{ open: boolean }>`
  padding: ${({ open }) => (open ? "20px 12px" : "20px 8px")};
  height: 100vh;
  position: relative;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const AccountElement = styled("div")<{ active: string }>`
  display: flex;
  flex-direction: row;
  align-items: end;
  background-color: #131f35;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  margin-left: 10px;

  :focus {
    border: 1px solid blue;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: none;
  }
`;

export const FTHMAmount = styled(AccountElement)`
  color: white;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  font-weight: 500;
  background-color: #131f35;
`;

export const FTHMWrapper = styled("span")`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`;

const MainToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1px;
  background: linear-gradient(180deg, #071126 0%, #050c1a 100%);

  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    width: 100px;
    margin-left: 14px;
  }
`;

const MenuLogoWrapper = styled(Box)`
  display: flex;
  width: 105px;
  align-items: center;
  justify-content: space-between;
`;

const MobileMenuWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 7px;
`;

const WalletBox = styled(Box)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  padding: 0 0 0 10px;
`;

const LogoLink = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MainLayout = () => {
  const {
    savedOpen,
    setSavedOpen,
    scroll,
    disconnect,
    openMobile,
    account,
    error,
    isMobile,
    isActive,
    open,
    isMetamask,
    isWalletConnect,
    isMobileFiltersOpen,
    toggleDrawer,
    mainBlockClickHandler,
    openMobileMenu,
    openMobileFilterMenu,
    drawerRef,
    showToggleDrawerBtn,
    setOpenMobile,
    userXDCBalance,
    showFthmBalanceModal,
    setShowFthmBalanceModal,
    aggregateBalance,
    countUpValue,
    countUpValuePrevious,
  } = useMainLayout();

  const {
    allowStableSwap,
    allowStableSwapInProgress,
    isUserWrapperWhiteListed,
    openConnector,
    setOpenConnector,
    openConnectorMenu,
  } = useConnector();

  /**
   * Load charts data.
   */
  useGlobalData();
  useGlobalChartData();

  /**
   * Google Analytics
   */
  const { pathname, search } = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: `${pathname}${search}` });
  }, [pathname, search]);

  const { erc20TokenModalData } = useAlertAndTransactionContext();

  return (
    <ThemeProvider theme={themeObject}>
      <Box sx={{ display: "flex" }} onClick={mainBlockClickHandler}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            {isMobile && (
              <MenuLogoWrapper>
                <LogoLink to={"/"}>
                  <img
                    src={FathomLogoMobileSrc}
                    alt={"logo"}
                    style={{
                      width: "24px",
                      background: "#80FFF6",
                      height: "24px",
                      borderRadius: "6px",
                      padding: "4px",
                    }}
                  />
                </LogoLink>

                <MobileMenuWrapper
                  onClick={openMobile ? mainBlockClickHandler : openMobileMenu}
                >
                  <img
                    style={{ display: openMobile ? "none" : "block" }}
                    src={MobileMenuIcon}
                    alt={"menu"}
                    width={20}
                    height={20}
                  />
                  <img
                    style={{ display: openMobile ? "block" : "none" }}
                    src={MobileMenuIconActive}
                    alt={"menu"}
                    width={20}
                    height={20}
                  />
                  Apps
                </MobileMenuWrapper>
              </MenuLogoWrapper>
            )}
            {!isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            ></Typography>

            <Web3Status />

            {isMetamask && <img src={MetamaskSrc} alt={"metamask"} />}
            {isWalletConnect && (
              <img src={WalletConnectSrc} alt={"wallet-connect"} />
            )}
            {aggregateBalance && (
              <FTHMWrapper onClick={() => setShowFthmBalanceModal(true)}>
                <FTHMAmount
                  active={account ? "true" : "false"}
                  style={{ pointerEvents: "auto" }}
                >
                  {account && (
                    <TYPE.white
                      style={{
                        paddingRight: ".4rem",
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={","}
                        duration={1}
                      />
                    </TYPE.white>
                  )}
                  FTHM
                </FTHMAmount>
                <CardNoise />
              </FTHMWrapper>
            )}
            <AccountElement
              active={account ? "true" : "false"}
              style={{ pointerEvents: "auto" }}
            >
              {account && userXDCBalance ? (
                <Box
                  sx={{ flexShrink: 0 }}
                  p="0.5rem 0.5rem 0.5rem 0.5rem"
                  fontWeight={500}
                >
                  {formatNumber(Number(userXDCBalance?.toSignificant(8)))}{" "}
                  {"XDC"}
                </Box>
              ) : null}
            </AccountElement>
            {account && !error && (
              <WalletBox>{truncateEthAddress(account)}</WalletBox>
            )}

            <IconButton
              color="inherit"
              onClick={isActive || error ? disconnect : openConnectorMenu}
            >
              {isActive ? (
                <img src={ExitSrc} alt={"exit"} />
              ) : (
                <AccountBalanceWalletIcon />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        {!isMobile && (
          <Drawer variant="permanent" open={open} ref={drawerRef}>
            <MainToolbar>
              {open && (
                <LogoLink to={"/"}>
                  <img
                    src={FathomAppLogoSrc}
                    alt={"logo"}
                    style={{
                      height: "none",
                      maxWidth: "140px",
                    }}
                  />
                </LogoLink>
              )}
              {showToggleDrawerBtn && (
                <ToggleDrawerButton open={open} onClick={toggleDrawer}>
                  {open ? (
                    <ArrowBack sx={{ fontSize: "0.9rem" }} />
                  ) : (
                    <ArrowForward sx={{ fontSize: "0.9rem", color: "#fff" }} />
                  )}
                </ToggleDrawerButton>
              )}
            </MainToolbar>
            <Divider />
            <MenuWrapper open={open}>
              <Menu open={open} />
              {!isMobile && open && <BottomLinks />}
            </MenuWrapper>
          </Drawer>
        )}
        <MainBox component="main">
          <Box>
            <Toolbar />
            <AlertMessages scroll={scroll} />
            <TransactionStatus scroll={scroll} />
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              {allowStableSwap ||
              isUserWrapperWhiteListed ||
              allowStableSwapInProgress ? (
                <Route path="/stable-swap" element={<StableSwap />} />
              ) : null}
              {isUserWrapperWhiteListed ? (
                <>
                  <Route
                    path="/stable-swap/add-liquidity"
                    element={<StableSwapAddLiquidity />}
                  />
                  <Route
                    path="/stable-swap/remove-liquidity"
                    element={<StableSwapRemoveLiquidity />}
                  />
                  <Route
                    path="/stable-swap/manage-fees"
                    element={<StableSwapManageFees />}
                  />
                </>
              ) : null}
              <Route path="/dao" element={<DaoView />}>
                <Route
                  index
                  element={
                    <StakingProvider>
                      <StakingView />
                    </StakingProvider>
                  }
                />
                <Route
                  path="staking"
                  index
                  element={
                    <StakingProvider>
                      <StakingView />
                    </StakingProvider>
                  }
                />
                <Route path="governance" element={<AllProposalsView />}></Route>
                <Route
                  path="governance/proposal/:_proposalId"
                  element={
                    <ProposalProvider>
                      <ProposalView />
                    </ProposalProvider>
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to="/dao/staking" replace />}
                />
              </Route>
              <Route
                path="/swap"
                element={<DexView openConnectorMenu={openConnectorMenu} />}
              >
                <Route index element={<Swap />} />
                <Route path=":outputCurrency" element={<RedirectToSwap />} />
                <Route path="send" element={<RedirectPathToSwapOnly />} />
                <Route path="find" element={<PoolFinder />} />
                <Route path="pool" element={<Pool />} />
                <Route path="add" element={<AddLiquidity />} />
                <Route
                  path="add/:currencyIdA"
                  element={<RedirectOldAddLiquidityPathStructure />}
                />
                <Route
                  path="add/:currencyIdA/:currencyIdB"
                  element={<RedirectDuplicateTokenIds />}
                />
                <Route path="create" element={<AddLiquidity />} />
                <Route
                  path="create/:currencyIdA"
                  element={<RedirectOldAddLiquidityPathStructure />}
                />
                <Route
                  path="create/:currencyIdA/:currencyIdB"
                  element={<RedirectDuplicateTokenIds />}
                />
                <Route
                  path="remove/:tokens"
                  element={<RedirectOldRemoveLiquidityPathStructure />}
                />
                <Route
                  path="remove/:currencyIdA/:currencyIdB"
                  element={<RemoveLiquidity />}
                />
                <Route
                  path="transactions"
                  element={
                    <ApolloProvider client={dexClient}>
                      <Transactions />
                    </ApolloProvider>
                  }
                />
                <Route element={<RedirectPathToSwapOnly />} />
              </Route>
              <Route
                path="/vault"
                element={
                  <AllVaultView
                    isMobileFiltersOpen={isMobileFiltersOpen}
                    openMobileFilterMenu={openMobileFilterMenu}
                  />
                }
              ></Route>
              <Route path="/charts" element={<ChartsView />}>
                <Route
                  index
                  element={
                    <LayoutWrapper
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    >
                      <GlobalPage />
                    </LayoutWrapper>
                  }
                ></Route>

                <Route
                  path="token/:tokenAddress"
                  element={
                    <TokenPageRouterComponent
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    />
                  }
                />
                <Route
                  path="pair/:pairAddress"
                  element={
                    <PairPageRouterComponent
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    />
                  }
                />
                <Route
                  path="account/:accountAddress"
                  element={
                    <AccountPageRouterComponent
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    />
                  }
                />

                <Route
                  path="tokens"
                  element={
                    <LayoutWrapper
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    >
                      <AllTokensPage />
                    </LayoutWrapper>
                  }
                ></Route>

                <Route
                  path="pairs"
                  element={
                    <LayoutWrapper
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    >
                      <AllPairsPage />
                    </LayoutWrapper>
                  }
                ></Route>

                <Route
                  path="accounts"
                  element={
                    <LayoutWrapper
                      savedOpen={savedOpen}
                      setSavedOpen={setSavedOpen}
                    >
                      <AccountLookup />
                    </LayoutWrapper>
                  }
                ></Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Copyright />
        </MainBox>
      </Box>
      {isMobile && openMobile && <MobileMenu setOpenMobile={setOpenMobile} />}
      {isMobile && openConnector && (
        <MobileConnector setOpenMobileConnector={setOpenConnector} />
      )}
      {!isMobile && openConnector && (
        <DesktopConnector onClose={() => setOpenConnector(false)} />
      )}

      <FthmInfoModal
        onClose={() => setShowFthmBalanceModal(false)}
        open={showFthmBalanceModal}
      >
        <FathomBalanceContent
          setShowFthmBalanceModal={setShowFthmBalanceModal}
        />
      </FthmInfoModal>
      {erc20TokenModalData && <TransactionErc20TokenModal />}
    </ThemeProvider>
  );
};

export default memo(MainLayout);
