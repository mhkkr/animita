import { getSession } from 'next-auth/react';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: `https://api.annict.com/graphql`,
});

const authLink = new SetContextLink(async (prevContext, operation) => {
  const session = await getSession();
  const token = session?.accessToken;
  return {
    headers: {
      ...prevContext.headers,
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