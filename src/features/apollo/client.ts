import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * ブラウザからは自前の /api/graphql のみ叩く。
 * Annict トークンはサーバー側 JWT に閉じ、クライアントへ露出しない。
 */
const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "same-origin",
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        viewer: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
      },
    },
  },
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export default apolloClient;
