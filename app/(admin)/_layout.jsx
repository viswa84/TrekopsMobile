import { Redirect, Tabs } from 'expo-router';
import { CalendarDays, LayoutDashboard, MessageSquare, MoreHorizontal, Ticket } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { colors, typography } from '../../src/theme';

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, bootstrapping } = useAuth();
  if (bootstrapping) return null;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  if (!isAdmin) return <Redirect href="/(customer)/treks" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          borderTopColor: colors.borderMuted,
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: typography.size['2xs'],
          fontWeight: typography.weight.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Ticket size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="departures"
        options={{
          title: 'Departures',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <MoreHorizontal size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen name="bookings/[id]" options={{ href: null }} />
      <Tabs.Screen name="departures/[id]" options={{ href: null }} />
      <Tabs.Screen name="chat/[phone]" options={{ href: null }} />
      <Tabs.Screen name="customers" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
