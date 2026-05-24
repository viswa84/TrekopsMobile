import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Mail, Phone as PhoneIcon, User as UserIcon } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import Card from '../../src/components/ui/Card';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';
import { ME } from '../../src/graphql/queries';
import { UPDATE_PROFILE } from '../../src/graphql/mutations';
import { colors, spacing, typography } from '../../src/theme';

export default function SettingsScreen() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const { data } = useQuery(ME);
  const me = data?.me;
  const prefs = me?.notificationPrefs || {};

  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (me) setForm({ name: me.name || '', email: me.email || '', phone: me.phone || '' });
    else if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [me, user]);

  const [updateMut, { loading }] = useMutation(UPDATE_PROFILE);

  const save = async () => {
    try {
      const { data: res } = await updateMut({ variables: { input: form } });
      await updateUser(res.updateProfile);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e?.message || 'Update failed');
    }
  };

  return (
    <Screen scroll>
      <PageHeader title="Profile" subtitle="Manage your account & preferences" back />

      <Card>
        <Text style={styles.title}>Personal info</Text>
        <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
          <Input label="Full name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} leftIcon={UserIcon} />
          <Input label="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} leftIcon={Mail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Phone" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} leftIcon={PhoneIcon} keyboardType="phone-pad" />
        </View>
        <View style={{ marginTop: spacing[4] }}>
          <Button onPress={save} loading={loading} fullWidth>Save changes</Button>
        </View>
      </Card>

      <Card style={{ marginTop: spacing[4] }}>
        <Text style={styles.title}>Notifications</Text>
        {[
          { key: 'newBooking', label: 'New booking' },
          { key: 'paymentReceived', label: 'Payment received' },
          { key: 'batchFull', label: 'Departure batch full' },
          { key: 'cancelation', label: 'Cancellations' },
          { key: 'lowSeats', label: 'Low seats remaining' },
          { key: 'marketing', label: 'Marketing updates' },
        ].map((p) => (
          <View key={p.key} style={styles.prefRow}>
            <Text style={styles.prefLabel}>{p.label}</Text>
            <Switch value={!!prefs[p.key]} disabled />
          </View>
        ))}
      </Card>

      {me?.companyName ? (
        <Card style={{ marginTop: spacing[4] }}>
          <Text style={styles.title}>Workspace</Text>
          <View style={styles.kv}><Text style={styles.k}>Company</Text><Text style={styles.v}>{me.companyName}</Text></View>
          <View style={styles.kv}><Text style={styles.k}>Code</Text><Text style={styles.v}>{me.companyCode}</Text></View>
          <View style={styles.kv}><Text style={styles.k}>Role</Text><Text style={styles.v}>{me.role}</Text></View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[2] },
  prefLabel: { fontSize: typography.size.sm, color: colors.text },
  kv: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[2] },
  k: { fontSize: typography.size.sm, color: colors.textMuted },
  v: { fontSize: typography.size.sm, color: colors.text, fontWeight: typography.weight.semibold },
});
