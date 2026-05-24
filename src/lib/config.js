import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const config = {
  graphqlUrl:
    process.env.EXPO_PUBLIC_GRAPHQL_URL || extra.graphqlUrl || 'http://localhost:8080/graphql',
  socketUrl:
    process.env.EXPO_PUBLIC_SOCKET_URL || extra.socketUrl || 'http://localhost:8080',
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL || extra.apiBaseUrl || 'http://localhost:8080',
};
