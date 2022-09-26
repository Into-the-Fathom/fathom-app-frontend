import React, { useCallback, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import Copyright from "../Footer/Footer";
import AppBar from "../AppBar/AppBar";
import { MainListItems, SecondaryListItems } from "./listItems";
import useMetaMask from "../../hooks/metamask";
import {
  Alert,
  Chip
} from "@mui/material";
import { observer } from "mobx-react";
import DashboardContent from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import StableSwap from "../Stableswap/StableSwap";
import Image from "mui-image";

import FathomLogoAqua from "../../assets/svg/Fathom-logo-aqua.svg";

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    border: "1px solid #222325",
    background: "#17181A",
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

const mdTheme = createTheme();

const MainLayout = observer(() => {
  const [open, setOpen] = useState<boolean>(true);
  const { connect, isActive, account } = useMetaMask()!;

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

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
            >
              FXD Stablecoin
            </Typography>
            <Chip label={account} color="primary" />
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
            }}
          >
            {open && (
              <Image
                duration={0}
                src={FathomLogoAqua}
                style={{
                  height: "none",
                  maxWidth: "120px",
                  marginLeft: "10px",
                }}
                wrapperStyle={{ justifyContent: "left" }}
              />
            )}
            <IconButton
              onClick={toggleDrawer}
              sx={{
                color: "#000",
                width: "20px",
                height: "20px",
                borderRadius: "20px",
                background: open ? "#808084" : "#3E3F45",
                padding: 0,
                position: "absolute",
                right: "-10px",
                "&:hover": { background: open ? "#3E3F45" : "#808084" },
              }}
            >
              {open ? (
                <ArrowBack sx={{ fontSize: "0.9rem" }} />
              ) : (
                <ArrowForward sx={{ fontSize: "0.9rem", color: "#fff" }} />
              )}
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems open={open} />
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems open={open} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: '#000',
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/swap" element={<StableSwap />} />
          </Routes>
          {/*<Alert severity="error">This is an error alert — check it out!</Alert>*/}
          {/*<Alert severity="warning">This is a warning alert — check it out!</Alert>*/}
          {/*<Alert severity="info">This is an info alert — check it out!</Alert>*/}
          {/*<Alert severity="success">This is a success alert — check it out!</Alert>*/}
          <Copyright sx={{ pt: 4 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
});

export default MainLayout;
