import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MessageCircle, Phone, Users } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import SearchBar from '../../src/components/ui/SearchBar';
import Avatar from '../../src/components/ui/Avatar';
import EmptyState from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { GET_CUSTOMERS } from '../../src/graphql/queries';
import { colors, palette, radius, shadow, spacing, typography } from '../../src/theme';
import { formatINR, maskPhone, formatDate } from '../../src/utils/format';

export default function CustomersScreen() {
  const [search, setSearch] = useState('');
  const { data, loading, refetch } = useQuery(GET_CUSTOMERS, { variables: { search: search || null } });
  const list = data?.getCustomers ?? [];

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader title="Customers" subtitle={`${list.length} ${list.length === 1 ? 'customer' : 'customers'}`} back />
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search name, phone, city…" />
      </View>

      {loading && !data ? (
        <View style={{ padding: spacing[4], gap: spacing[3] }}>
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} height={90} />)}
        </View>
      ) : list.length === 0 ? (
        <EmptyState icon={Users} title="No customers" message="As customers book treks, they'll appear here." />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(c) => c._id}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[20], gap: spacing[3] }}
          onRefresh={() => refetch()}
          refreshing={loading}
          renderItem={({ item }) => <CustomerRow c={item} />}
        />
      )}
    </Screen>
  );
}

function CustomerRow({ c }) {
  return (
    <View style={styles.row}>
      <Avatar name={c.name} size={44} />
      <View style={{ flex: 1, marginLeft: spacing[3] }}>
        <Text style={styles.name} numberOfLines={1}>{c.name || 'Unknown'}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {maskPhone(c.phone)}{c.city ? ` · ${c.city}` : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginTop: 4 }}>
          <Text style={styles.kpi}>
            <Text style={{ color: palette.primary[700], fontWeight: typography.weight.bold }}>{c.totalTreks || 0}</Text> treks
          </Text>
          <Text style={styles.kpi}>
            LTV: <Text style={{ color: colors.text, fontWeight: typography.weight.bold }}>{formatINR(c.ltv)}</Text>
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <Pressable
          onPress={() => Linking.openURL(`tel:${c.phone}`)}
          style={[styles.iconBtn, { backgroundColor: palette.primary[50] }]}
        >
          <Phone size={16} color={palette.primary[600]} />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(`https://wa.me/${c.phone}`)}
          style={[styles.iconBtn, { backgroundColor: palette.primary[600] }]}
        >
          <MessageCircle size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.borderMuted,
    padding: spacing[3],
    ...shadow.xs,
  },
  name: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text },
  meta: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
  kpi: { fontSize: typography.size.xs, color: colors.textMuted },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
});
