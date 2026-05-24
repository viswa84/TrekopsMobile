import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, FileDown, Mail, MapPin, MessageCircle, Phone, Users } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

import Screen from '../../../src/components/ui/Screen';
import PageHeader from '../../../src/components/ui/PageHeader';
import Card from '../../../src/components/ui/Card';
import Button from '../../../src/components/ui/Button';
import StatusBadge from '../../../src/components/ui/StatusBadge';
import Divider from '../../../src/components/ui/Divider';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { GET_BOOKING } from '../../../src/graphql/queries';
import { config } from '../../../src/lib/config';
import { getCachedToken } from '../../../src/lib/storage';
import { colors, palette, spacing, typography } from '../../../src/theme';
import { formatINR, formatDateTime } from '../../../src/utils/format';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, loading } = useQuery(GET_BOOKING, { variables: { id } });
  const b = data?.getBooking;

  return (
    <Screen scroll>
      <PageHeader title="Booking" subtitle={b?.txnid ? `#${b.txnid}` : '…'} back />
      {loading || !b ? (
        <Card><Skeleton height={120} /></Card>
      ) : (
        <>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[3] }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.trek}>{b.trekName}</Text>
                <Text style={styles.city}>{b.cityName || '—'}</Text>
              </View>
              <StatusBadge status={b.status} />
            </View>

            <Divider />

            <Row icon={Users} label="Customer" value={b.name || '—'} />
            <Row icon={Phone} label="Phone" value={b.phone || '—'} action={() => Linking.openURL(`tel:${b.phone}`)} actionLabel="Call" />
            {b.email ? <Row icon={Mail} label="Email" value={b.email} /> : null}
            <Row icon={Calendar} label="Booked" value={formatDateTime(b.createdAt)} />
            <Row icon={Users} label="People" value={`${b.peopleCount || 1}`} />
          </Card>

          {b.packageBreakdown?.length ? (
            <Card style={{ marginTop: spacing[4] }}>
              <Text style={styles.cardTitle}>Packages</Text>
              {b.packageBreakdown.map((p, i) => (
                <View key={i} style={styles.pkg}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: typography.weight.semibold, color: colors.text }}>{p.packageName}</Text>
                    <Text style={{ fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 }}>
                      {p.count} × {formatINR(p.pricePerPerson)}
                    </Text>
                  </View>
                  <Text style={{ fontWeight: typography.weight.bold, color: colors.text }}>
                    {formatINR(p.subtotal)}
                  </Text>
                </View>
              ))}
            </Card>
          ) : null}

          <Card style={{ marginTop: spacing[4] }}>
            <Text style={styles.cardTitle}>Payment</Text>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Total</Text>
              <Text style={styles.payValue}>{formatINR(b.amount)}</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Paid</Text>
              <Text style={[styles.payValue, { color: palette.primary[700] }]}>{formatINR(b.paidAmount)}</Text>
            </View>
            {b.pendingAmount > 0 ? (
              <View style={styles.payRow}>
                <Text style={styles.payLabel}>Pending</Text>
                <Text style={[styles.payValue, { color: palette.amber[700] }]}>{formatINR(b.pendingAmount)}</Text>
              </View>
            ) : null}
            {b.paymentLink ? (
              <View style={{ marginTop: spacing[3] }}>
                <Button onPress={() => WebBrowser.openBrowserAsync(b.paymentLink)} variant="soft" fullWidth>
                  Open payment link
                </Button>
              </View>
            ) : null}
          </Card>

          <View style={{ flexDirection: 'row', gap: spacing[3], marginTop: spacing[4] }}>
            <Button
              onPress={() => Linking.openURL(`https://wa.me/${b.phone}`)}
              variant="secondary"
              leftIcon={MessageCircle}
              style={{ flex: 1 }}
            >
              WhatsApp
            </Button>
            <Button
              onPress={async () => {
                const token = getCachedToken();
                const url = `${config.apiBaseUrl}/api/booking-pdf/${b._id}?token=${token || ''}`;
                WebBrowser.openBrowserAsync(url);
              }}
              leftIcon={FileDown}
              style={{ flex: 1 }}
            >
              Invoice
            </Button>
          </View>
        </>
      )}
    </Screen>
  );
}

function Row({ icon: Icon, label, value, action, actionLabel }) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap]}>
        {Icon ? <Icon size={14} color={colors.primary} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {action ? (
        <Text onPress={action} style={styles.rowAction}>{actionLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trek: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text },
  city: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: 2 },
  cardTitle: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text, marginBottom: spacing[3] },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[2] },
  iconWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: palette.primary[50], alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: typography.size.xs, color: colors.textMuted },
  rowValue: { fontSize: typography.size.sm, color: colors.text, fontWeight: typography.weight.medium, marginTop: 1 },
  rowAction: { fontSize: typography.size.xs, fontWeight: typography.weight.bold, color: colors.primary, padding: 4 },
  pkg: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[2] },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[2] },
  payLabel: { fontSize: typography.size.sm, color: colors.textMuted },
  payValue: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text },
});
