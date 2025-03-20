
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import Cookies from 'js-cookie';


const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URI,
});

const authMiddleware = new ApolloLink((oparetion, forward) => {
  oparetion.setContext({
    headers: {
      accesstoken: Cookies.get("accessToken"),
      refreshtoken: Cookies.get("refreshToken"),
    },
  });
  return forward(oparetion);
});

export const graphqlClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache()
});
  

  
  