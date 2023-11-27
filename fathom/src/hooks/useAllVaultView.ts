import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const useAllVaultView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [vaultCurrentPage, setVaultCurrentPage] = useState(1);
  const [vaultItemsCount, setVaultItemsCount] = useState(0);

  return {
    vaultCurrentPage,
    vaultItemsCount,
    isMobile,
    setVaultCurrentPage,
    setVaultItemsCount,
  };
};

export default useAllVaultView;
