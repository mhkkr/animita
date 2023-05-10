import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// 2. http linkの生成
const httpLink = createHttpLink({
  uri: `https://api.annict.com/graphql`,
});

// 3. headerをリクエストを送る前のコンテキストに追加する
const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem('token');
  const token = 'FM9fYDfYSkIf1nwWvaMtQMu1JNka434vwYwxfjrWi8c';
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

// 4. apollo clientのインスタンスの初期化
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default apolloClient;