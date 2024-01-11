import { Trans } from "@lingui/macro";
import InfoIcon from "@mui/icons-material/Info";
import {
  Button,
  Slide,
  SvgIcon,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import { useEffect, useState } from "react";
import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";
import { useRootStore } from "apps/lending/store/root";
import { ENABLE_TESTNET } from "apps/lending/utils/marketsAndNetworksConfig";

import { Link } from "apps/lending/components/primitives/Link";
import { uiConfig } from "apps/lending/uiConfig";
import { NavItems } from "apps/lending/layouts/components/NavItems";
import { MobileMenu } from "apps/lending/layouts/MobileMenu";
import { SettingsMenu } from "apps/lending/layouts/SettingsMenu";
import WalletWidget from "apps/lending/layouts/WalletWidget";

interface Props {
  children: React.ReactElement;
}

function HideOnScroll({ children }: Props) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down("md"));
  const trigger = useScrollTrigger({ threshold: md ? 160 : 80 });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function AppHeader() {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down("md"));
  const sm = useMediaQuery(breakpoints.down("sm"));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useRootStore((state) => [
    state.mobileDrawerOpen,
    state.setMobileDrawerOpen,
  ]);

  const [walletWidgetOpen, setWalletWidgetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileDrawerOpen && !md) {
      setMobileDrawerOpen(false);
    }
    if (walletWidgetOpen) {
      setWalletWidgetOpen(false);
    }
  }, [md]);

  const headerHeight = 48;

  const toggleWalletWigit = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setWalletWidgetOpen(state);
  };

  const toggleMobileMenu = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setMobileMenuOpen(state);
  };

  const disableTestnet = () => {
    localStorage.setItem("testnetsEnabled", "false");
    // Set window.location to trigger a page reload when navigating to the the dashboard
    window.location.href = "/";
  };

  const testnetTooltip = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: 1,
      }}
    >
      <Typography variant="subheader1">
        <Trans>Testnet mode is ON</Trans>
      </Typography>
      <Typography variant="description">
        <Trans>The app is running in testnet mode. Learn how it works in</Trans>{" "}
        <Link
          href="https://docs.aave.com/faq/testing-aave"
          style={{
            fontSize: "14px",
            fontWeight: 400,
            textDecoration: "underline",
          }}
        >
          FAQ.
        </Link>
      </Typography>
      <Button variant="outlined" sx={{ mt: "12px" }} onClick={disableTestnet}>
        <Trans>Disable testnet</Trans>
      </Button>
    </Box>
  );

  return (
    <HideOnScroll>
      <Box
        component="header"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sx={(theme) => ({
          height: headerHeight,
          position: "sticky",
          top: 0,
          transition: theme.transitions.create("top"),
          zIndex: theme.zIndex.appBar,
          background: theme.palette.gradients.fathomGradient,
          padding: {
            xs:
              mobileMenuOpen || walletWidgetOpen
                ? "8px 20px"
                : "8px 8px 8px 20px",
            xsm: "8px 20px",
          },
          display: "flex",
          alignItems: "center",
          flexDirection: "space-between",
          boxShadow: "inset 0px -1px 0px rgba(242, 243, 247, 0.16)",
        })}
      >
        <Box
          component={Link}
          href="/"
          aria-label="Go to homepage"
          sx={{
            lineHeight: 0,
            mr: 3,
            transition: "0.3s ease all",
            "&:hover": { opacity: 0.7 },
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <img src={uiConfig.appLogo} alt="AAVE" width={120} height={25} />
        </Box>
        <Box sx={{ mr: sm ? 1 : 3 }}>
          {ENABLE_TESTNET && (
            <ContentWithTooltip
              tooltipContent={testnetTooltip}
              offset={[0, -4]}
              withoutHover
            >
              <Button
                variant="surface"
                size="small"
                color="primary"
                sx={(theme) => ({
                  color: "#00332f",
                  background: theme.palette.gradients.fathomlightGradient,
                  "&:hover, &.Mui-focusVisible": {
                    backgroundColor: "rgba(182, 80, 158, 0.7)",
                  },
                })}
              >
                TESTNET
                <SvgIcon sx={{ marginLeft: "2px", fontSize: "16px" }}>
                  <InfoIcon />
                </SvgIcon>
              </Button>
            </ContentWithTooltip>
          )}
        </Box>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <NavItems />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {!mobileMenuOpen && (
          <WalletWidget
            open={walletWidgetOpen}
            setOpen={toggleWalletWigit}
            headerHeight={headerHeight}
          />
        )}

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <SettingsMenu />
        </Box>

        {!walletWidgetOpen && (
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <MobileMenu
              open={mobileMenuOpen}
              setOpen={toggleMobileMenu}
              headerHeight={headerHeight}
            />
          </Box>
        )}
      </Box>
    </HideOnScroll>
  );
}