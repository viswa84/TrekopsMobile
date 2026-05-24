import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Building2, ChevronRight, Globe2, LogOut, Map, Megaphone, Receipt, Settings, ShieldCheck, User2, Users,
} from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import Card from '../../src/components/ui/Card';
import Avatar from '../../src/components/ui/Avatar';
import Badge from '../../src/components/ui/Badge';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { ME } from '../../src/graphql/queries';
import { colors, palette, radius, spacing, typography } from '../../src/theme';

const SECTIONS = [
  {
    title: 'Operations',
    items: [
      { label: 'Customers', icon: Users, route: '/(admin)/customers' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile & Settings', icon: Settings, route: '/(admin)/settings' },
    ],
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const toast = useToast();
  const { data } = useQuery(ME);
  const me = data?.me || user;

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out');
    router.replace('/auth/login');
  };

  return (
    <Screen scroll>
      <PageHeader title="More" />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <Avatar name={me?.name || me?.username} uri={me?.avatar} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{me?.name || me?.username || 'User'}</Text>
            <Text style={styles.meta}>{me?.email || me?.phone || '—'}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              <Badge tone={me?.role === 'superadmin' ? 'purple' : 'primary'}>
                {me?.role || 'user'}
              </Badge>
              {me?.companyName ? <Badge tone="neutral">{me.companyName}</Badge> : null}
            </View>
          </View>
        </View>
      </Card>

      {SECTIONS.map((s) => (
        <View key={s.title} style={{ marginTop: spacing[5] }}>
          <Text style={styles.section}>{s.title}</Text>
          <Card padded={false}>
            {s.items.map((it, i) => (
              <Pressable
                key={it.label}
                onPress={() => router.push(it.route)}
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomWidth: i === s.items.length - 1 ? 0 : 1 },
                  pressed && { backgroundColor: colors.bgMuted },
                ]}
              >
                <View style={[styles.icon, { backgroundColor: palette.primary[50] }]}>
                  <it.icon size={16} color={palette.primary[600]} />
                </View>
                <Text style={styles.rowText}>{it.label}</Text>
                <ChevronRight size={16} color={colors.textSubtle} />
              </Pressable>
            ))}
          </Card>
        </View>
      ))}

      <View style={{ marginTop: spacing[6] }}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logout, pressed && { opacity: 0.85 }]}
        >
          <LogOut size={16} color={palette.red[600]} />
          <Text style={{ color: palette.red[700], fontWeight: typography.weight.bold, fontSize: typography.size.base }}>
            Sign out
          </Text>
        </Pressable>
      </View>

      <Text style={styles.version}>TrekOps Mobile · v1.0.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  meta: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: 2 },
  section: { fontSize: typography.size.xs, fontWeight: typography.weight.bold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[2], marginLeft: spacing[1] },
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
