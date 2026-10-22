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
        // 先に viewerUser で正規化された User 参照へ、id を含まない
        // libraryEntries / records の結果を足す。スプレッドだと __ref が残り、
        // 後から書いたフィールドがエンティティに載らず読み戻せなくなる。
        viewer: {
          merge: true,
        },
      },
    },
    Work: {
      fields: {
        reviews: {
          keyArgs: ["orderBy", "hasBody"],
          merge(existing, incoming, { args }) {
            if (!existing || !args?.after) {
              return incoming;
            }
            const existingNodes = existing.nodes ?? [];
            const incomingNodes = incoming.nodes ?? [];
            const seen = new Set(
              existingNodes
                .map((node: { __ref?: string }) => node?.__ref)
                .filter((ref: string | undefined): ref is string => Boolean(ref)),
            );
            return {
              ...incoming,
              nodes: [
                ...existingNodes,
                ...incomingNodes.filter((node: { __ref?: string }) => !node?.__ref || !seen.has(node.__ref)),
              ],
            };
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
