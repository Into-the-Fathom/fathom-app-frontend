import { Grid, Container } from "@mui/material";
import PositionsList from "components/PositionList/PositionsList";
import ProtocolStats from "components/Dashboard/ProtocolStats";
import PoolsListView from "components/Pools/PoolsListView";
import { PageHeader } from "components/Dashboard/PageHeader";
import useSharedContext from "context/shared";
import useDashboard from "context/fxd";

const DashboardContent = () => {
  const {
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
    loadingPositions,
    fetchProxyWallet,
  } = useDashboard();
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          title={"FXD"}
          description={`FXD is overcollateralized, decentralized, and softly pegged stablecoin.`}
        />
        <Grid item xs={12}>
          <ProtocolStats />
        </Grid>
        <Grid item xs={12} mt={3}>
          <PoolsListView
            proxyWallet={proxyWallet}
            fetchProxyWallet={fetchProxyWallet}
          />
        </Grid>
        <Grid item xs={12} mt={4}>
          <PositionsList
            loadingPositions={loadingPositions}
            positionCurrentPage={positionCurrentPage}
            positionsItemsCount={positionsItemsCount}
            proxyWallet={proxyWallet}
            setPositionCurrentPage={setPositionCurrentPage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardContent;
