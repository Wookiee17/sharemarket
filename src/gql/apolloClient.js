import { useMemo } from 'react'
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from '@apollo/client/link/error'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { typePolicies } from './typePolicies';

const isBrowser = typeof window !== 'undefined'

let apolloClient

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL,
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
  },
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((_, { headers }) => {
    return {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": `${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
      },
    };
  });
  return forward(operation);
})

const wsLink = isBrowser ? new WebSocketLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL_WS,
  options: {
    lazy: true,
    reconnect: true,
  },
}) : null

// To load WS transport on browser
const splitLink = isBrowser ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
) : httpLink;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({ typePolicies: typePolicies }),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}


export function useApollo(initialState) {

  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
