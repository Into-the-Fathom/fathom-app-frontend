import React, { useCallback, useEffect, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Menu as MenuIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import Copyright from "../Footer/Footer";
import AppBar from "../AppComponents/AppBar/AppBar";
import useMetaMask from "../../hooks/metamask";
import { observer } from "mobx-react";
import DashboardContent from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import StableSwap from "../Stableswap/StableSwap";
import Image from "mui-image";

import FathomAppLogo from "../../assets/svg/Fathom-app-logo.svg";
import { useStores } from "../../stores";
import { Web3Status } from "../Web3Status/Web3Status";
import AllProposalsView from "../Governance/ViewAllProposals";
import ProposalView from "../Governance/Proposal";
import MakePropose from "../Governance/Propose";
import StakingView from "../Staking/StakingView";
import AlertMessages from "../Common/AlertMessages";
import TransactionStatus from "../Transaction/TransactionStatus";
import truncateEthAddress from "truncate-eth-address";
import { Menu } from "./Menu";
import { ToggleDrawerButton } from "../AppComponents/AppButton/AppButton";

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
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

const mdTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00FFF6",
    },
    secondary: {
      main: "#808084",
    },
  },
  typography: {
    fontFamily: [
      "Inter, sans-serif"
    ].join(','),
  },
});

const MainLayout = observer(() => {
  const [open, setOpen] = useState<boolean>(true);
  const { connect, isActive, account, chainId, error } = useMetaMask()!;

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const rootStore = useStores();

  useEffect(() => {
    rootStore.setChainId(chainId!);
  }, [chainId, rootStore]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
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
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            ></Typography>
            {account && !error && (
              <Chip label={truncateEthAddress(account)} color="primary" />
            )}
            <Web3Status />
            <IconButton color="inherit" onClick={connect}>
              {isActive ? <LogoutIcon /> : <AccountBalanceWalletIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
              background: "linear-gradient(180deg, #071126 0%, #050C1A 100%)",
            }}
          >
            {open && (
              <Image
                duration={0}
                src={FathomAppLogo}
                style={{
                  height: "none",
                  maxWidth: "140px",
                  marginLeft: "22px",
                }}
                wrapperStyle={{ justifyContent: "left" }}
              />
            )}
            <ToggleDrawerButton
              open={open}
              onClick={toggleDrawer}
            >
              {open ? (
                <ArrowBack sx={{ fontSize: "0.9rem" }} />
              ) : (
                <ArrowForward sx={{ fontSize: "0.9rem", color: "#fff" }} />
              )}
            </ToggleDrawerButton>
          </Toolbar>
          <Divider />
          <List
            component="nav"
            sx={{
              padding: "20px 12px",
            }}
          >
            <Menu open={open} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            background: "linear-gradient(180deg, #071126 0%, #050C1A 100%)",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <AlertMessages />
          <TransactionStatus />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/swap" element={<StableSwap />} />
              <Route path="/proposals" element={<AllProposalsView />} />
              <Route path="/proposal/make-proposal" element={<MakePropose />} />
              <Route path="/proposal/:_proposalId" element={<ProposalView />} />
              <Route path="/staking" element={<StakingView />} />
            </Routes>
          </Container>
          <Copyright/>
        </Box>
      </Box>
    </ThemeProvider>
  );
});

export default MainLayout;
