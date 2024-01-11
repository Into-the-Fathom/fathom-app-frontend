import { Trans } from "@lingui/macro";
import { Box, Button, Typography } from "@mui/material";
import { UnsupportedChainIdError } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { UserRejectedRequestError } from "apps/lending/libs/web3-data-provider/WalletConnectConnector";
import { WalletType } from "apps/lending/libs/web3-data-provider/WalletOptions";
import { useRootStore } from "apps/lending/store/root";
import { AUTH } from "apps/lending/utils/mixPanelEvents";

import { Warning } from "apps/lending/components/primitives/Warning";
import { TxModalTitle } from "apps/lending/components/transactions/FlowCommons/TxModalTitle";

export type WalletRowProps = {
  walletName: string;
  walletType: WalletType;
};
const WalletRow = ({ walletName, walletType }: WalletRowProps) => {
  const { connectWallet, loading } = useWeb3Context();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const getWalletIcon = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.INJECTED:
        return (
          <img
            src={`/icons/wallets/browserWallet.svg`}
            width="24px"
            height="24px"
            alt={`browser wallet icon`}
          />
        );
      case WalletType.WALLET_CONNECT:
        return (
          <img
            src={`/icons/wallets/walletConnect.svg`}
            width="24px"
            height="24px"
            alt={`browser wallet icon`}
          />
        );
      default:
        return null;
    }
  };

  const connectWalletClick = () => {
    trackEvent(AUTH.CONNECT_WALLET, {
      walletType: walletType,
      walletName: walletName,
    });
    connectWallet(walletType);
  };
  return (
    <Button
      disabled={loading}
      variant="surface"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        mb: "8px",
      }}
      size="large"
      onClick={connectWalletClick}
      endIcon={getWalletIcon(walletType)}
    >
      {walletName}
    </Button>
  );
};

export enum ErrorType {
  UNSUPORTED_CHAIN,
  USER_REJECTED_REQUEST,
  UNDETERMINED_ERROR,
  NO_WALLET_DETECTED,
}

export const WalletSelector = () => {
  const { error } = useWeb3Context();

  let blockingError: ErrorType | undefined = undefined;
  if (error) {
    if (error instanceof UnsupportedChainIdError) {
      blockingError = ErrorType.UNSUPORTED_CHAIN;
    } else if (error instanceof UserRejectedRequestError) {
      blockingError = ErrorType.USER_REJECTED_REQUEST;
    } else if (error instanceof NoEthereumProviderError) {
      blockingError = ErrorType.NO_WALLET_DETECTED;
    } else {
      blockingError = ErrorType.UNDETERMINED_ERROR;
    }
    // TODO: add other errors
  }

  const handleBlocking = () => {
    switch (blockingError) {
      case ErrorType.UNSUPORTED_CHAIN:
        return <Trans>Network not supported for this wallet</Trans>;
      case ErrorType.USER_REJECTED_REQUEST:
        return <Trans>Rejected connection request</Trans>;
      case ErrorType.NO_WALLET_DETECTED:
        return (
          <Trans>
            Wallet not detected. Connect or install wallet and retry
          </Trans>
        );
      default:
        console.log("Uncatched error: ", error);
        return <Trans>Error connecting. Try refreshing the page.</Trans>;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TxModalTitle title="Connect a wallet" />
      {error && <Warning severity="error">{handleBlocking()}</Warning>}
      <WalletRow
        key="browser_wallet"
        walletName="Browser wallet"
        walletType={WalletType.INJECTED}
      />
      <WalletRow
        key="walletconnect_wallet"
        walletName="WalletConnect"
        walletType={WalletType.WALLET_CONNECT}
      />
      <Typography variant="helperText">
        <Trans>
          Wallets are provided by External Providers and by selecting you agree
          to Terms of those Providers. Your access to the wallet might be
          reliant on the External Provider being operational.
        </Trans>
      </Typography>
    </Box>
  );
};
