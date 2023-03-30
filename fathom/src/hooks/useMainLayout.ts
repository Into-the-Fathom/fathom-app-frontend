import { useCallback, useEffect, useState, MouseEvent } from "react";
import useConnector from "context/connector";
import { useStores } from "stores";
import { useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";

const useMainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState<boolean>(!isMobile);
  const {
    disconnect,
    isActive,
    account,
    chainId,
    error,
    isMetamask,
    isXdcPay,
    isWalletConnect,
  } = useConnector()!;

  const [openMobile, setOpenMobile] = useState(false);
  const [openConnector, setOpenConnector] = useState(false);
  const currentPath = useLocation();
  const [scroll, setScroll] = useState<number>(0);

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const rootStore = useStores();

  const scrollHandler = useCallback((event: Event) => {
    setScroll(window.scrollY)
  }, [setScroll])

  useEffect(() => {
    if (chainId) {
      rootStore.setChainId(chainId!);
    }
  }, [chainId, rootStore]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, [scrollHandler])

  useEffect(() => {
    if (isMobile) {
      const inputs = document.querySelectorAll('input[type="number"]');
      for (let i = inputs.length; i--;) {
        inputs[i].setAttribute("pattern", "\\d*");
      }
    }
  }, [currentPath, isMobile]);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile, setOpen]);

  const mainBlockClickHandler = useCallback(() => {
    if (isMobile && (openMobile || openConnector)) {
      setOpenMobile(false);
      setOpenConnector(false);
    }
  }, [isMobile, openMobile, openConnector, setOpenMobile, setOpenConnector]);

  const openMobileMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setOpenMobile(true);
    },
    [setOpenMobile]
  );

  const openConnectorMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      setOpenConnector(true);
    },
    [setOpenConnector]
  );

  return {
    scroll,
    account,
    error,
    isMobile,
    isActive,
    open,
    disconnect,
    isMetamask,
    isXdcPay,
    isWalletConnect,
    toggleDrawer,
    openMobile,
    setOpenMobile,
    openConnector,
    setOpenConnector,
    mainBlockClickHandler,
    openMobileMenu,
    openConnectorMenu,
  };
};

export default useMainLayout;
