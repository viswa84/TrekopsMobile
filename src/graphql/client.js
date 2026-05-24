import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { config } from '../lib/config';
import { getCachedToken, storage } from '../lib/storage';

const httpLink = createHttpLink({ uri: config.graphqlUrl });

const authLink = setContext(async (_, { headers }) => {
  let token = getCachedToken();
  if (!token) token = await storage.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getTreks: { merge: false },
          getBookings: { merge: false },
          getCustomers: { merge: false },
          getDepartures: { merge: false },
          getCampaigns: { merge: false },
          getInvoices: { merge: false },
          getPayments: { merge: false },
          getRefunds: { merge: false },
          getNotifications: { merge: false },
          getCities: { merge: false },
          getParticipantsByDeparture: { merge: false },
          getMessages: {
            keyArgs: ['phone'],
            merge(existing, incoming) {
              const existingMsgs = existing?.messages ?? [];
              const incomingMsgs = incoming?.messages ?? [];
              return { ...incoming, messages: [...incomingMsgs, ...existingMsgs] };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
    query: { fetchPolicy: 'cache-first', errorPolicy: 'all' },
  },
});

export default apolloClient;
