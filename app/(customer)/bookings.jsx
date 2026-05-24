import { useQuery } from '@apollo/client/react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ticket } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import StatusBadge from '../../src/components/ui/StatusBadge';
import EmptyState from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { useAuth } from '../../src/context/AuthContext';
import { GET_BOOKINGS } from '../../src/graphql/queries';
import { colors, palette, radius, shadow, spacing, typography } from '../../src/theme';
import { formatDate, formatINR } from '../../src/utils/format';

export default function CustomerBookingsScreen() {
  const { user } = useAuth();
  const { data, loading, refetch } = useQuery(GET_BOOKINGS);
  const list = (data?.getBookings ?? []).filter((b) => {
    if (!user?.phone) return true;
    return b.phone === user.phone || b.email === user.email;
  });

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader title="My Trips" subtitle={`${list.length} ${list.length === 1 ? 'trip' : 'trips'}`} />
      </View>

      {loading && !data ? (
        <View style={{ padding: spacing[4], gap: spacing[3] }}>
          {[0, 1, 2].map((i) => <SkeletonCard key={i} height={110} />)}
        </View>
      ) : list.length === 0 ? (
        <EmptyState icon={Ticket} title="No trips yet" message="Your bookings will show up here." />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(b) => b._id}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[20], gap: spacing[3] }}
          onRefresh={() => refetch()}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trek}>{item.trekName}</Text>
                  <Text style={styles.meta}>{item.cityName || '—'} · {formatDate(item.createdAt)}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.txn}>#{item.txnid}</Text>
                <Text style={styles.amount}>{formatINR(item.amount)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.borderMuted,
    padding: spacing[4],
    ...shadow.xs,
  },
  trek: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text },
  meta: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.borderMuted, marginVertical: spacing[3] },
  txn: { fontSize: typography.size.xs, color: colors.textSubtle, fontFamily: 'Courier' },
  amount: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
});
