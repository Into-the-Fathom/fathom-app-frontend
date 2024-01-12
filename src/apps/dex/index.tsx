import { FC, memo } from "react";
import Blocklist from "apps/dex/components/Blocklist";
import "apps/dex/i18n";
import App from "apps/dex/pages/App";
import ApplicationUpdater from "apps/dex/state/application/updater";
import ListsUpdater from "apps/dex/state/lists/updater";
import MulticallUpdater from "apps/dex/state/multicall/updater";
import TransactionUpdater from "apps/dex/state/transactions/updater";
import ThemeProvider from "apps/dex/theme";
import { DexViewProps } from "components/Dashboard/DexView";
import { AppsSharedProvider } from "context/appsShared";

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

export const Updaters = () => {
  return (
    <>
      <ListsUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
};

const DexIndexComponent: FC<DexViewProps> = ({ openConnectorMenu }) => {
  return (
    <>
      <Blocklist>
        <ThemeProvider>
          <>
            <AppsSharedProvider openConnectorMenu={openConnectorMenu}>
              <App />
            </AppsSharedProvider>
          </>
        </ThemeProvider>
      </Blocklist>
    </>
  );
};

export default memo(DexIndexComponent);
