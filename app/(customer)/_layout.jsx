import { Redirect, Tabs } from 'expo-router';
import { Compass, MessageSquare, Ticket, User2 } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { colors, typography } from '../../src/theme';

export default function CustomerLayout() {
  const { isAuthenticated, isAdmin, bootstrapping } = useAuth();
  if (bootstrapping) return null;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  if (isAdmin) return <Redirect href="/(admin)/dashboard" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          borderTopColor: colors.borderMuted,
          height: 64, paddingTop: 6, paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: typography.size['2xs'],
          fontWeight: typography.weight.semibold,
        },
      }}
    >
      <Tabs.Screen name="treks" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <Compass size={size - 2} color={color} /> }} />
      <Tabs.Screen name="bookings" options={{ title: 'My Trips', tabBarIcon: ({ color, size }) => <Ticket size={size - 2} color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Support', tabBarIcon: ({ color, size }) => <MessageSquare size={size - 2} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User2 size={size - 2} color={color} /> }} />
      <Tabs.Screen name="treks/[id]" options={{ href: null }} />
    </Tabs>
  );
}
