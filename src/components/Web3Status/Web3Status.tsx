import { UnsupportedChainIdError } from "@web3-react/core";
import {
  RightNetwork,
  WrongNetwork,
  WrongNetworkMobile,
  WrongNetworkMobileIcon,
} from "components/AppComponents/AppBox/AppBox";
import {
  XDC_CHAIN_IDS,
  NETWORK_LABELS,
  ChainId,
  XDC_NETWORK_SETTINGS,
} from "connectors/networks";
import { getTokenLogoURL } from "utils/tokenLogo";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ReactElement, useCallback, useMemo, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import { Box } from "@mui/material";
import useConnector from "context/connector";
import useSharedContext from "context/shared";

const NetworkPaper = styled(AppPaper)`
  background: #253656;
  border: 1px solid #4f658c;
  box-shadow: 0px 12px 32px #000715;
  border-radius: 8px;
  padding: 4px;

  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;

    li {
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 6px;

      &:hover {
        background: #324567;
      }
    }
  }
`;

const EmptyButtonWrapper = styled(Box)`
  padding: 3px;
  border-radius: 8px;
  margin-right: 10px;
  cursor: auto;
  background: #253656;
  &.error {
    background: transparent;
    margin-right: 0;
  }
`;

const Web3Status = () => {
  const { error, account, chainId, isMetamask } = useConnector();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { isMobile } = useSharedContext();

  let button: null | ReactElement = null;

  const options = useMemo(
    () =>
      Object.entries(NETWORK_LABELS).filter(([filterChainId]) => {
        return Number(filterChainId) !== chainId;
      }),
    [chainId]
  );

  const requestChangeNetwork = useCallback(
    async (chainId: number) => {
      setOpen(false);
      if (window && window.ethereum) {
        try {
          window.ethereum.request?.({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
        } catch (err: any) {
          console.log(err);
          if (err.code === 4902) {
            window.ethereum.request?.({
              method: "wallet_addEthereumChain",
              params: [(XDC_NETWORK_SETTINGS as any)[chainId]],
            });
          }
        }
      }
    },
    [setOpen]
  );

  const showNetworkSelector =
    (chainId || error instanceof UnsupportedChainIdError) &&
    options.length &&
    isMetamask;

  const isError = error || (chainId && !XDC_CHAIN_IDS.includes(chainId));

  if (XDC_CHAIN_IDS.includes(chainId)) {
    button = (
      <RightNetwork onClick={() => setOpen(!open)}>
        <>
          <img src={getTokenLogoURL("WXDC")} alt={"xdc"} width={16} />
          {!isMobile && NETWORK_LABELS[chainId as ChainId]}
          {showNetworkSelector ? <ArrowDropDownIcon /> : null}
        </>
      </RightNetwork>
    );
  } else if (isError) {
    button = isMobile ? (
      <WrongNetworkMobile onClick={() => setOpen(!open)}>
        <WrongNetworkMobileIcon />
        {showNetworkSelector ? <ArrowDropDownIcon /> : null}
      </WrongNetworkMobile>
    ) : (
      <WrongNetwork
        onClick={() => setOpen(!open)}
        sx={{ padding: showNetworkSelector ? "4px 12px" : "6px 16px" }}
      >
        <>
          {error instanceof UnsupportedChainIdError ||
          !XDC_CHAIN_IDS.includes(chainId)
            ? "Wrong Network"
            : !account
            ? "Wallet Request Permissions Error"
            : "Error"}
          {showNetworkSelector ? <ArrowDropDownIcon /> : null}
        </>
      </WrongNetwork>
    );
  }

  return (chainId ||
    error instanceof UnsupportedChainIdError ||
    !XDC_CHAIN_IDS.includes(chainId)) &&
    options.length &&
    isMetamask ? (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        {button}
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "center bottom",
            }}
          >
            <NetworkPaper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map(([chainId, chainName]) => (
                    <MenuItem
                      onClick={() => requestChangeNetwork(Number(chainId))}
                      key={chainId}
                    >
                      {chainName}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </NetworkPaper>
          </Grow>
        )}
      </Popper>
    </>
  ) : button ? (
    <EmptyButtonWrapper className={`empty-box ${isError ? "error" : ""}`}>
      {button}
    </EmptyButtonWrapper>
  ) : null;
};

export default Web3Status;
