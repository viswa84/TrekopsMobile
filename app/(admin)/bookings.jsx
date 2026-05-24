import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays, ChevronRight, Phone, Ticket } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import SearchBar from '../../src/components/ui/SearchBar';
import Pill from '../../src/components/ui/Pill';
import StatusBadge from '../../src/components/ui/StatusBadge';
import EmptyState from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { GET_BOOKINGS } from '../../src/graphql/queries';
import { colors, palette, radius, shadow, spacing, typography } from '../../src/theme';
import { formatINR, formatDate, maskPhone } from '../../src/utils/format';

const STATUSES = ['all', 'paid', 'pending', 'partial', 'failed'];

export default function BookingsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const { data, loading, refetch } = useQuery(GET_BOOKINGS, {
    variables: { status: status === 'all' ? null : status },
  });

  const bookings = useMemo(() => {
    let list = data?.getBookings ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          (b.name || '').toLowerCase().includes(q) ||
          (b.phone || '').includes(q) ||
          (b.trekName || '').toLowerCase().includes(q) ||
          (b.txnid || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, search]);

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader title="Bookings" subtitle={`${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`} />
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search name, phone, trek…" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3] }}>
          {STATUSES.map((s) => (
            <Pill key={s} active={status === s} onPress={() => setStatus(s)}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Pill>
          ))}
        </View>
      </View>

      {loading && !data ? (
        <View style={{ padding: spacing[4], gap: spacing[3] }}>
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          message="When customers book a trek, you'll see them here."
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[20], gap: spacing[3] }}
          onRefresh={() => refetch()}
          refreshing={loading}
          renderItem={({ item }) => <BookingRow booking={item} onPress={() => router.push(`/(admin)/bookings/${item._id}`)} />}
        />
      )}
    </Screen>
  );
}

function BookingRow({ booking, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.trek} numberOfLines={1}>{booking.trekName || 'Trek'}</Text>
          <Text style={styles.customer}>{booking.name || '—'}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.divider} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Phone size={12} color={colors.textSubtle} />
            <Text style={styles.meta}>{maskPhone(booking.phone)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <CalendarDays size={12} color={colors.textSubtle} />
            <Text style={styles.meta}>{formatDate(booking.createdAt)}</Text>
          </View>
        </View>
        <ChevronRight size={16} color={colors.textSubtle} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[2] }}>
        <Text style={styles.txn} numberOfLines={1}>#{booking.txnid}</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.amount}>{formatINR(booking.amount)}</Text>
          {booking.pendingAmount > 0 ? (
            <Text style={styles.pending}>{formatINR(booking.pendingAmount)} due</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: spacing[4],
    ...shadow.xs,
  },
  trek: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text },
  customer: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.borderMuted, marginVertical: spacing[3] },
  meta: { fontSize: typography.size.xs, color: colors.textMuted },
  txn: { fontSize: typography.size.xs, color: colors.textSubtle, fontFamily: 'Courier' },
  amount: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  pending: { fontSize: typography.size['2xs'], color: palette.amber[700], fontWeight: typography.weight.semibold },
});
