import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SUBGRAPH_URLS } from "connectors/networks";
import { DEFAULT_CHAIN_ID } from "../utils/Constants";

/***
 * For Query we have pagination, So we need to return incoming items
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        positions: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
        proposals: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
        pools: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
        strategyHistoricalAprs: {
          keyArgs: ["strategy", "chainId"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        strategyReports: {
          keyArgs: ["strategy", "chainId"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        accountVaultPositions: {
          keyArgs: ["account"],
          merge(_, incoming) {
            return incoming;
          },
        },
        vaults: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
        indexingStatusForCurrentVersion: {
          keyArgs: ["chainId"],
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Staker: {
      fields: {
        lockPositions: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const httpLink = new HttpLink({ uri: SUBGRAPH_URLS[DEFAULT_CHAIN_ID] });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = operation.getContext().chainId;

  let uri =
    chainId && (SUBGRAPH_URLS as any)[chainId]
      ? (SUBGRAPH_URLS as any)[chainId]
      : SUBGRAPH_URLS[DEFAULT_CHAIN_ID];

  if (operation.getContext().clientName === "stable") {
    uri += "/subgraphs/name/stablecoin-subgraph";
  } else if (operation.getContext().clientName === "governance") {
    uri += "/subgraphs/name/dao-subgraph";
  } else if (operation.getContext().clientName === "vaults") {
    uri += "/subgraphs/name/vaults-subgraph";
  } else {
    uri += "/graphql";
  }

  operation.setContext(() => ({
    uri,
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
});

export const dexClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://xinfin-graph.fathom.fi/subgraphs/name/dex-subgraph",
  }),
  cache: new InMemoryCache(),
});

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://xinfin-graph.fathom.fi/graphql",
  }),
  cache: new InMemoryCache(),
});

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://xinfin-graph.fathom.fi/subgraphs/name/blocklytics/ethereum-blocks",
  }),
  cache: new InMemoryCache(),
});
