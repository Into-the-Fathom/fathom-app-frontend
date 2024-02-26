import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import StyledToggleButton from "apps/lending/components/StyledToggleButton";
import StyledToggleButtonGroup from "apps/lending/components/StyledToggleButtonGroup";
import { usePermissions } from "apps/lending/hooks/usePermissions";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";

import { ConnectWalletPaper } from "apps/lending/components/ConnectWalletPaper";
import { ContentContainer } from "apps/lending/components/ContentContainer";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { DashboardContentWrapper } from "apps/lending/modules/dashboard/DashboardContentWrapper";

export default function Home() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { currentMarket } = useProtocolDataContext();
  const { isPermissionsLoading } = usePermissions();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const [mode, setMode] = useState<"supply" | "borrow" | "">("supply");
  useEffect(() => {
    trackEvent("Page Viewed", {
      "Page Name": "Dashboard",
      Market: currentMarket,
    });
  }, [trackEvent]);

  return (
    <>
      <ContentContainer>
        {currentAccount && !isPermissionsLoading && (
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              justifyContent: { xs: "center", xsm: "flex-start" },
              mb: { xs: 3, xsm: 4 },
            }}
          >
            <StyledToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(_, value) => setMode(value)}
              sx={{ width: { xs: "100%", xsm: "359px" }, height: "44px" }}
            >
              <StyledToggleButton value="supply" disabled={mode === "supply"}>
                <Typography variant="subheader1">Supply</Typography>
              </StyledToggleButton>
              <StyledToggleButton value="borrow" disabled={mode === "borrow"}>
                <Typography variant="subheader1">Borrow</Typography>
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        )}

        {currentAccount && !isPermissionsLoading ? (
          <DashboardContentWrapper isBorrow={mode === "borrow"} />
        ) : (
          <ConnectWalletPaper loading={web3Loading} />
        )}
      </ContentContainer>
    </>
  );
}
