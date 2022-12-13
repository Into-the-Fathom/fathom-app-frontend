import "fontsource-roboto";
import "./App.css";
import { HashRouter as Router } from "react-router-dom";
import MainLayout from "components/Dashboard/MainLayout";
import { ApolloProvider } from "@apollo/client";
import { client } from "apollo/client";
import { SyncProvider } from "context/sync";
import { PricesProvider } from "context/prices";

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <SyncProvider>
          <PricesProvider>
            <MainLayout />
          </PricesProvider>
        </SyncProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;
