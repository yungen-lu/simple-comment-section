// import { ApolloClient } from 'apollo-client';
// import { ApolloLink } from 'apollo-link';
import { HttpLink } from '@apollo/client/link/http';
// import { WebSocketLink } from '@apollo/client/link/ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { getOperationAST } from 'graphql';
// ort { gql } from '@apollo/client/core';
// import gql from 'graphql-tag';
// import { split, HttpLink } from "@apollo/client/link";
// import { getMainDefinition } from 'apollo'
// import { ApolloLink } from 'apollo-link';
import { split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloClient } from 'apollo-client';

class ConnectTo {
  constructor(domain, port, url) {
    const httpLink = new HttpLink({
      uri: `http://${domain}:${port}${url}`,
    });

    const wsLink = new WebSocketLink({
      uri: `ws://${domain}:${port}${url}`,
      options: {
        reconnect: true,
      },
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    );
    this.client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
  }
  async wsQuery(DATA) {
    return this.client
      .subscribe({
        query: DATA,
      })
      // .subscribe({
      //   next(re) {
      //     console.log(re);
      //   },
      // });
  }
  async httpMutate(DATA, objOfVar) {
    return this.client.mutate({
      mutation: DATA,
      variables: objOfVar,
    });
    // .then((e) => {
    //   console.log(e.data);
    // })
    // .catch((e) => {
    //   console.error(e);
    // });
  }
  async httpQuery(DATA, objOfVar) {
    return this.client.query({
      query: DATA,
      variables: objOfVar,
    });
  }
}
// module.exports = {
//   ConnectTo,
// }
export { ConnectTo };
