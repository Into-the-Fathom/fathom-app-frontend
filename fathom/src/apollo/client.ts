import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

//TODO: Use the environment dev/prod/staging to fetch the url.. 
//Break down the url into base url (env specific) and graph name into constats.
const STABLE_COIN_DEV =
  "http://159.223.112.169:8000/subgraphs/name/stablecoin-subgraph";

  const STABLECOIN_SUBGRAPH_DEMO =
  "https://graph.composer.live/subgraphs/name/stablecoin-subgraph";

  const DAO_SUBGRAPH_DEMO =
  "https://graph.composer.live/subgraphs/name/dao-subgraph";

  /***
 * For Query we have pagination, So we need to return incoming items
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        positions: {
          keyArgs: false,
          merge(existing = [], incoming, other) {
            return incoming;
          },
        },
        proposals: {
          keyArgs: false,
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Staker: {
      fields: {
        lockPositions: {
          keyArgs: false,
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const stableCoinLink = new HttpLink({
  uri: STABLECOIN_SUBGRAPH_DEMO,
});

const governanceLink = new HttpLink({
  uri: DAO_SUBGRAPH_DEMO,
});

const defaultLink = new HttpLink({
  uri: "https://graph.composer.live/graphql",
});

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "stable", // Routes the query to the proper client
    stableCoinLink,
    ApolloLink.split(
      (operation) => operation.getContext().clientName === "governance", // Routes the query to the proper client
      governanceLink,
      defaultLink
    )
  ),
  cache,
});
