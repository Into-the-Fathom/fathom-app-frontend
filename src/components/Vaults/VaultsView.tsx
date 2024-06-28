import { useMemo } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import useSharedContext from "context/shared";
import { TutorialIcon, VaultManagement } from "components/Common/MenuIcons";

const VaultsView = () => {
  const location = useLocation();
  const { vaultAddress } = useParams();
  const { isMobile } = useSharedContext();

  const isVaultListActive = useMemo(() => {
    return location.pathname === "/vaults";
  }, [location.pathname]);

  const isVaultTutorialActive = useMemo(
    () => location.pathname.includes("tutorial"),
    [location.pathname]
  );

  const isVaultVaultDetail = useMemo(() => !!vaultAddress, [vaultAddress]);

  return (
    <>
      {!isVaultVaultDetail && (
        <NestedRouteNav>
          <NestedRouteLink
            className={isVaultListActive ? "active" : ""}
            to="/vaults"
          >
            <VaultManagement isactive={isVaultListActive ? "true" : ""} />
            Vault Management
          </NestedRouteLink>
          <NestedRouteLink
            className={isVaultTutorialActive ? "active" : ""}
            to="/vaults/tutorial"
          >
            <TutorialIcon isactive={isVaultTutorialActive ? "true" : ""} />
            Tutorial
          </NestedRouteLink>
        </NestedRouteNav>
      )}
      <NestedRouteContainer
        maxWidth="lg"
        sx={{
          mt: isMobile ? 3 : 4,
          mb: isMobile ? 3 : 4,
        }}
      >
        <Outlet />
      </NestedRouteContainer>
    </>
  );
};

export default VaultsView;
