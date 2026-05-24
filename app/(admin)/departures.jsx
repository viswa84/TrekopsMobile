import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CalendarDays, ChevronRight, MapPin, Users } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import SearchBar from '../../src/components/ui/SearchBar';
import Pill from '../../src/components/ui/Pill';
import StatusBadge from '../../src/components/ui/StatusBadge';
import EmptyState from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { GET_DEPARTURES } from '../../src/graphql/queries';
import { colors, palette, radius, shadow, spacing, typography } from '../../src/theme';
import { formatDate, formatINR } from '../../src/utils/format';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Open', label: 'Open' },
  { key: 'Almost Full', label: 'Almost Full' },
  { key: 'Full', label: 'Full' },
  { key: 'Canceled', label: 'Cancelled' },
];

export default function DeparturesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, loading, refetch } = useQuery(GET_DEPARTURES, {
    variables: { status: filter === 'all' ? null : filter },
  });

  const departures = useMemo(() => {
    let list = data?.getDepartures ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          (d.trekName || '').toLowerCase().includes(q) ||
          (d.cityName || '').toLowerCase().includes(q) ||
          (d.uniqueId || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, search]);

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader title="Departures" subtitle={`${departures.length} departure${departures.length === 1 ? '' : 's'}`} />
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search trek, city, code…" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3] }}>
          {FILTERS.map((f) => (
            <Pill key={f.key} active={filter === f.key} onPress={() => setFilter(f.key)}>
              {f.label}
            </Pill>
          ))}
        </View>
      </View>

      {loading && !data ? (
        <View style={{ padding: spacing[4], gap: spacing[3] }}>
          {[0, 1, 2].map((i) => <SkeletonCard key={i} height={160} />)}
        </View>
      ) : departures.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No departures" message="Schedule a departure batch to see it here." />
      ) : (
        <FlatList
          data={departures}
          keyExtractor={(d) => d._id}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[20], gap: spacing[3] }}
          onRefresh={() => refetch()}
          refreshing={loading}
          renderItem={({ item }) => <DepartureRow d={item} onPress={() => router.push(`/(admin)/departures/${item._id}`)} />}
        />
      )}
    </Screen>
  );
}

function DepartureRow({ d, onPress }) {
  const pct = Math.min(100, Math.round(((d.booked || 0) / (d.capacity || 1)) * 100));
  const barColor =
    pct >= 100 ? palette.red[500] : pct >= 80 ? palette.amber[500] : palette.primary[500];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: spacing[2] }}>
          <Text style={styles.trek} numberOfLines={1}>{d.trekName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} color={colors.textSubtle} />
              <Text style={styles.meta}>{d.cityName || '—'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} color={colors.textSubtle} />
              <Text style={styles.meta}>{formatDate(d.startDate)}</Text>
            </View>
          </View>
        </View>
        <StatusBadge status={d.status} />
      </View>

      <View style={styles.barWrap}>
        <View style={[styles.bar, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Users size={12} color={colors.textSubtle} />
          <Text style={styles.meta}>
            {d.booked || 0}/{d.capacity || 0} booked
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <Text style={styles.price}>{formatINR(d.price)}</Text>
          <ChevronRight size={16} color={colors.textSubtle} />
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
  meta: { fontSize: typography.size.xs, color: colors.textMuted },
  barWrap: { height: 6, borderRadius: 3, backgroundColor: colors.bgMuted, marginTop: spacing[3], overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 3 },
  price: { fontSize: typography.size.sm, fontWeight: typography.weight.bold, color: colors.primaryText },
});
