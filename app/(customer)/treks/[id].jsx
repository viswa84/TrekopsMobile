import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Calendar, MapPin, Mountain, Snowflake, Users } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import Screen from '../../../src/components/ui/Screen';
import PageHeader from '../../../src/components/ui/PageHeader';
import Card from '../../../src/components/ui/Card';
import Badge from '../../../src/components/ui/Badge';
import Button from '../../../src/components/ui/Button';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import EmptyState from '../../../src/components/ui/EmptyState';
import { GET_DEPARTURES } from '../../../src/graphql/queries';
import { gql } from '@apollo/client';
import { colors, difficultyColors, palette, radius, spacing, typography } from '../../../src/theme';
import { formatDate, formatINR } from '../../../src/utils/format';
import { config } from '../../../src/lib/config';

const GET_TREK_DETAIL = gql`
  query GetTrekDetail($id: ID!) {
    getTrek(id: $id) {
      master {
        _id name description difficulty duration price startFrom
        image images location altitude bestSeason
        itinerary thingsToCarry contact
      }
      liveInstances { _id goLiveDate seatsTotal seatsAvailable isActive name price }
    }
  }
`;

export default function TrekDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, loading } = useQuery(GET_TREK_DETAIL, { variables: { id } });
  const { data: depData } = useQuery(GET_DEPARTURES, { variables: { trekId: id } });

  const trek = data?.getTrek?.master;
  const departures = (depData?.getDepartures ?? []).filter((d) => d.status !== 'Canceled');

  if (loading && !trek) {
    return (
      <Screen scroll>
        <PageHeader title="Trek" back />
        <Skeleton height={220} style={{ borderRadius: radius.xl }} />
      </Screen>
    );
  }

  if (!trek) return null;

  const dc = difficultyColors[trek.difficulty] || difficultyColors.Moderate;

  return (
    <Screen scroll padded={false}>
      <View style={{ padding: spacing[4] }}>
        <PageHeader title={trek.name} subtitle={trek.location} back />
      </View>

      <Image
        source={{ uri: trek.image || trek.images?.[0] }}
        style={{ width: '100%', height: 220, backgroundColor: colors.bgMuted }}
        contentFit="cover"
        transition={200}
      />

      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
          <Badge tone="primary">{trek.difficulty}</Badge>
          {trek.duration ? <Badge tone="info">{trek.duration}</Badge> : null}
          {trek.altitude ? <Badge tone="purple">{trek.altitude}</Badge> : null}
          {trek.bestSeason ? <Badge tone="warning">{trek.bestSeason}</Badge> : null}
        </View>

        {trek.description ? (
          <Text style={{ fontSize: typography.size.base, color: colors.textMuted, lineHeight: 22 }}>
            {trek.description}
          </Text>
        ) : null}

        <Card>
          <Text style={styles.section}>Upcoming departures</Text>
          {departures.length === 0 ? (
            <EmptyState title="No departures scheduled" message="Check back soon!" />
          ) : (
            <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
              {departures.map((d) => {
                const left = (d.capacity || 0) - (d.booked || 0);
                return (
                  <View key={d._id} style={styles.depCard}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} color={colors.textSubtle} />
                        <Text style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, color: colors.text }}>
                          {formatDate(d.startDate)} — {formatDate(d.endDate)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginTop: 4 }}>
                        <Text style={{ fontSize: typography.size.xs, color: colors.textMuted }}>
                          From {d.cityName || '—'}
                        </Text>
                        <Text style={{ fontSize: typography.size.xs, color: colors.textMuted }}>
                          {left > 0 ? `${left} seats left` : 'Sold out'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={styles.depPrice}>{formatINR(d.price)}</Text>
                      <Button
                        size="sm"
                        disabled={left <= 0}
                        onPress={() => WebBrowser.openBrowserAsync(`${config.apiBaseUrl}/book/${d.uniqueId}`)}
                      >
                        {left > 0 ? 'Book' : 'Full'}
                      </Button>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        {trek.itinerary ? (
          <Card>
            <Text style={styles.section}>Itinerary</Text>
            <Text style={{ marginTop: spacing[2], color: colors.text, lineHeight: 22 }}>{trek.itinerary}</Text>
          </Card>
        ) : null}

        {trek.thingsToCarry ? (
          <Card>
            <Text style={styles.section}>What to carry</Text>
            <Text style={{ marginTop: spacing[2], color: colors.text, lineHeight: 22 }}>{trek.thingsToCarry}</Text>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  depCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing[3],
    padding: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: colors.bgMuted,
  },
  depPrice: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.primaryText },
});
