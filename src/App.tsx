import "./App.css";
import MainLayout from "components/Dashboard/MainLayout";
import { ApolloProvider } from "@apollo/client";
import { SyncProvider } from "context/sync";
import { PricesProvider } from "context/prices";
import { Updaters } from "apps/dex";
import { SharedProvider } from "context/shared";
import { Provider } from "react-redux";
import store from "apps/dex/state";
import { ContextProviders, Updaters as ChartUpdaters } from "apps/charts";
import ReactGA from "react-ga4";
import { isMobile } from "react-device-detect";
import { client } from "apollo/client";

// initialize GA
const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

if (typeof GOOGLE_ANALYTICS_ID === "string") {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: "none",
      storeGac: false,
    },
  });
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? "desktop"
      : "web3" in window || "ethereum" in window
      ? "mobileWeb3"
      : "mobileRegular",
  });
} else {
  ReactGA.initialize("test", { testMode: true });
}

function App() {
  return (
    <ApolloProvider client={client}>
      <SyncProvider>
        <PricesProvider>
          <SharedProvider>
            <Provider store={store}>
              <ContextProviders>
                <>
                  <Updaters />
                  <ChartUpdaters />
                  <MainLayout />
                </>
              </ContextProviders>
            </Provider>
          </SharedProvider>
        </PricesProvider>
      </SyncProvider>
    </ApolloProvider>
  );
}

export default App;
