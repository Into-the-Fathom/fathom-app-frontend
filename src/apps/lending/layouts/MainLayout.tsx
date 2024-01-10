import { Box } from "@mui/material";
import { ReactNode } from "react";
import AnalyticsConsent from "apps/lending/components/Analytics/AnalyticsConsent";
import { FORK_ENABLED } from "apps/lending/utils/marketsAndNetworksConfig";

import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <Box
        component="main"
        sx={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        {children}
      </Box>

      <AppFooter />
      {FORK_ENABLED ? null : <AnalyticsConsent />}
    </>
  );
}
