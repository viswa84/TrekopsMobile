import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, HelpCircle, LogOut, Settings as SettingsIcon, Shield } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import Card from '../../src/components/ui/Card';
import Avatar from '../../src/components/ui/Avatar';
import Badge from '../../src/components/ui/Badge';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { colors, palette, radius, spacing, typography } from '../../src/theme';

export default function CustomerProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const items = [
    { label: 'Account & Settings', icon: SettingsIcon },
    { label: 'Notifications', icon: Bell },
    { label: 'Privacy & Security', icon: Shield },
    { label: 'Help & Support', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out');
    router.replace('/auth/login');
  };

  return (
    <Screen scroll>
      <PageHeader title="Profile" />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <Avatar name={user?.name || user?.phone} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name || user?.username || 'Trekker'}</Text>
            <Text style={styles.meta}>{user?.phone || user?.email || '—'}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              <Badge tone="primary">Customer</Badge>
              {user?.companyName ? <Badge tone="neutral">{user.companyName}</Badge> : null}
            </View>
          </View>
        </View>
      </Card>

      <Card padded={false} style={{ marginTop: spacing[4] }}>
        {items.map((it, i) => (
          <Pressable
            key={it.label}
            style={({ pressed }) => [styles.row, { borderBottomWidth: i === items.length - 1 ? 0 : 1 }, pressed && { backgroundColor: colors.bgMuted }]}
          >
            <View style={[styles.icon, { backgroundColor: palette.primary[50] }]}>
              <it.icon size={16} color={palette.primary[600]} />
            </View>
            <Text style={styles.rowText}>{it.label}</Text>
          </Pressable>
        ))}
      </Card>

      <View style={{ marginTop: spacing[6] }}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logout, pressed && { opacity: 0.85 }]}
        >
          <LogOut size={16} color={palette.red[600]} />
          <Text style={{ color: palette.red[700], fontWeight: typography.weight.bold }}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={styles.version}>TrekOps Mobile · v1.0.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  meta: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], gap: spacing[3], borderBottomColor: colors.borderMuted },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, fontSize: typography.size.base, color: colors.text, fontWeight: typography.weight.medium },
  logout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: palette.red[50],
    borderRadius: radius.xl,
    padding: spacing[4],
    borderWidth: 1, borderColor: palette.red[200],
  },
  version: { textAlign: 'center', fontSize: typography.size.xs, color: colors.textSubtle, marginTop: spacing[6] },
});
