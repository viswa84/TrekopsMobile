import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Calendar, MapPin, Mountain } from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import SearchBar from '../../src/components/ui/SearchBar';
import Pill from '../../src/components/ui/Pill';
import Badge from '../../src/components/ui/Badge';
import EmptyState from '../../src/components/ui/EmptyState';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { GET_TREKS } from '../../src/graphql/queries';
import { colors, difficultyColors, palette, radius, shadow, spacing, typography } from '../../src/theme';
import { formatINR } from '../../src/utils/format';

const DIFFICULTIES = ['All', 'Easy', 'Moderate', 'Hard', 'Extreme'];

export default function TreksScreen() {
  const router = useRouter();
  const [diff, setDiff] = useState('All');
  const [search, setSearch] = useState('');

  const { data, loading, refetch } = useQuery(GET_TREKS, { variables: { isActive: true } });
  const all = data?.getTreks ?? [];

  const filtered = useMemo(() => {
    let list = all.filter((t) => t.isActive !== false);
    if (diff !== 'All') list = list.filter((t) => t.difficulty === diff);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.name || '').toLowerCase().includes(q) ||
          (t.location || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [all, diff, search]);

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <PageHeader title="Explore Treks" subtitle="Discover your next adventure" />
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search by name or place…" />
        <View style={{ flexDirection: 'row', gap: spacing[2], marginTop: spacing[3] }}>
          {DIFFICULTIES.map((d) => (
            <Pill key={d} active={diff === d} onPress={() => setDiff(d)}>
              {d}
            </Pill>
          ))}
        </View>
      </View>

      {loading && !data ? (
        <View style={{ padding: spacing[4], gap: spacing[3] }}>
          {[0, 1, 2].map((i) => <SkeletonCard key={i} height={220} />)}
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Mountain} title="No treks found" message="Try a different filter or search." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(t) => t._id}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[20], gap: spacing[4] }}
          onRefresh={() => refetch()}
          refreshing={loading}
          renderItem={({ item }) => <TrekCard trek={item} onPress={() => router.push(`/(customer)/treks/${item._id}`)} />}
        />
      )}
    </Screen>
  );
}

function TrekCard({ trek, onPress }) {
  const dc = difficultyColors[trek.difficulty] || difficultyColors.Moderate;
  const cover =
    trek.image ||
    trek.images?.[0] ||
    `https://source.unsplash.com/800x500/?mountain,trek,${encodeURIComponent(trek.name || '')}`;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}>
      <View>
        <Image source={{ uri: cover }} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.imageOverlay}>
          <Badge tone="neutral" style={{ backgroundColor: 'rgba(0,0,0,0.55)', borderColor: 'transparent' }}>
            <Text style={{ color: '#FFFFFF', fontSize: typography.size['2xs'], fontWeight: typography.weight.bold, textTransform: 'uppercase' }}>
              {trek.difficulty}
            </Text>
          </Badge>
        </View>
      </View>

      <View style={{ padding: spacing[4] }}>
        <Text style={styles.name} numberOfLines={1}>{trek.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginTop: 4 }}>
          {trek.location ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} color={colors.textSubtle} />
              <Text style={styles.meta}>{trek.location}</Text>
            </View>
          ) : null}
          {trek.duration ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} color={colors.textSubtle} />
              <Text style={styles.meta}>{trek.duration}</Text>
            </View>
          ) : null}
        </View>
        {trek.description ? (
          <Text style={styles.desc} numberOfLines={2}>{trek.description}</Text>
        ) : null}
        <View style={styles.footer}>
          <View>
            <Text style={{ fontSize: typography.size.xs, color: colors.textMuted }}>Starts from</Text>
            <Text style={styles.price}>{formatINR(trek.price)}</Text>
          </View>
          <Badge tone="primary">View →</Badge>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.borderMuted,
    overflow: 'hidden',
    ...shadow.sm,
  },
  image: { width: '100%', height: 180, backgroundColor: colors.bgMuted },
  imageOverlay: { position: 'absolute', top: 12, left: 12 },
  name: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  meta: { fontSize: typography.size.xs, color: colors.textMuted },
  desc: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: spacing[2], lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing[3] },
  price: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.primaryText },
});
