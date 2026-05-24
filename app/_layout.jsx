import { ApolloProvider } from '@apollo/client/react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { apolloClient } from '../src/graphql/client';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';
import { SocketProvider } from '../src/context/SocketContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="(admin)" />
                  <Stack.Screen name="(customer)" />
                </Stack>
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
