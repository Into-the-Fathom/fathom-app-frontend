import "fontsource-roboto";
import "./App.css";
import { HashRouter as Router } from "react-router-dom";
import MainLayout from "components/Dashboard/MainLayout";
import { ApolloProvider } from "@apollo/client";
import { client } from "apollo/client";
import { SyncProvider } from "context/sync";
import { PricesProvider } from "context/prices";
import { Updaters } from "apps/dex";
import { SharedProvider } from "context/shared";

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <SyncProvider>
          <PricesProvider>
            <SharedProvider>
              <>
                <Updaters />
                <MainLayout />
              </>
            </SharedProvider>
          </PricesProvider>
        </SyncProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
