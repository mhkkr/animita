import { getSession } from 'next-auth/react';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `https://api.annict.com/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.accessToken;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        viewer: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          }
        }
      }
    }
  }
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
  // connectToDevTools: true
});

export default apolloClient;