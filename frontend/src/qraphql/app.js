import { HttpLink } from '@apollo/client/link/http';
import { InMemoryCache } from '@apollo/client/cache';
import { split } from '@apollo/client/link/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloClient } from '@apollo/client/core';

class ConnectTo {
  constructor(WS_URI,HTTP_URI) {
    const httpLink = new HttpLink({
      uri: HTTP_URI,
      credentials: 'include',
    });

    const wsLink = new WebSocketLink({
      uri: WS_URI,
      credentials: 'include',
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
    return this.client.subscribe({
      query: DATA,
    });
  }
  async httpMutate(DATA, objOfVar) {
    return this.client.mutate({
      mutation: DATA,
      variables: objOfVar,
    });
  }
  async httpQuery(DATA, objOfVar) {
    return this.client.query({
      query: DATA,
      variables: objOfVar,
    });
  }
}
export { ConnectTo };
