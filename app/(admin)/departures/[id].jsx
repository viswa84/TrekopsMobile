import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Bus, Calendar, ClipboardList, MapPin, MessageCircle, Phone, ShieldCheck, Users,
} from 'lucide-react-native';
import { Image } from 'expo-image';

import Screen from '../../../src/components/ui/Screen';
import PageHeader from '../../../src/components/ui/PageHeader';
import Card from '../../../src/components/ui/Card';
import Badge from '../../../src/components/ui/Badge';
import StatusBadge from '../../../src/components/ui/StatusBadge';
import EmptyState from '../../../src/components/ui/EmptyState';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import {
  GET_DEPARTURE,
  GET_PARTICIPANTS_BY_DEPARTURE,
} from '../../../src/graphql/queries';
import { colors, palette, radius, spacing, typography } from '../../../src/theme';
import { formatDate, formatINR, maskPhone } from '../../../src/utils/format';

export default function DepartureDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data, loading } = useQuery(GET_DEPARTURE, { variables: { id } });
  const { data: pData } = useQuery(GET_PARTICIPANTS_BY_DEPARTURE, { variables: { departureId: id } });

  const d = data?.getDeparture;
  const participants = pData?.getParticipantsByDeparture ?? [];

  return (
    <Screen scroll>
      <PageHeader title={d?.trekName || 'Departure'} subtitle={d?.uniqueId} back />
      {loading || !d ? (
        <Card><Skeleton height={120} /></Card>
      ) : (
        <>
          {d.imageUrl ? (
            <Image
              source={{ uri: d.imageUrl }}
              style={{ width: '100%', height: 180, borderRadius: radius.xl, marginBottom: spacing[3] }}
              contentFit="cover"
            />
          ) : null}

          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <MapPin size={14} color={colors.textSubtle} />
                  <Text style={styles.metaText}>{d.cityName}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginTop: 4 }}>
                  <Calendar size={14} color={colors.textSubtle} />
                  <Text style={styles.metaText}>
                    {formatDate(d.startDate)} — {formatDate(d.endDate)}
                  </Text>
                </View>
                {d.duration ? <Text style={styles.metaText}>{d.duration}</Text> : null}
              </View>
              <StatusBadge status={d.status} />
            </View>
          </Card>

          <View style={{ flexDirection: 'row', gap: spacing[3], marginTop: spacing[3] }}>
            <Stat label="Booked" value={`${d.booked || 0}/${d.capacity || 0}`} />
            <Stat label="Per seat" value={formatINR(d.price)} />
          </View>

          {d.guideName ? (
            <Card style={{ marginTop: spacing[3] }}>
              <Text style={styles.cardTitle}>Guide</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <ShieldCheck size={16} color={palette.primary[600]} />
                <Text style={{ fontSize: typography.size.base, fontWeight: typography.weight.semibold, color: colors.text }}>
                  {d.guideName}
                </Text>
              </View>
            </Card>
          ) : null}

          {d.meetingPoint || d.transport ? (
            <Card style={{ marginTop: spacing[3] }}>
              <Text style={styles.cardTitle}>Logistics</Text>
              {d.meetingPoint ? (
                <Row icon={MapPin} label="Meeting point" value={d.meetingPoint} />
              ) : null}
              {d.transport ? (
                <Row icon={Bus} label="Transport" value={d.transport} />
              ) : null}
            </Card>
          ) : null}

          <Card style={{ marginTop: spacing[3] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] }}>
              <Text style={styles.cardTitle}>Participants</Text>
              <Badge tone="primary">{participants.length}</Badge>
            </View>
            {participants.length === 0 ? (
              <EmptyState icon={Users} title="No participants yet" />
            ) : (
              <View style={{ gap: spacing[3] }}>
                {participants.map((p) => (
                  <View key={p.bookingId} style={styles.participant}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: typography.weight.semibold, color: colors.text }}>
                        {p.participants?.[0]?.name || 'Guest'}
                      </Text>
                      <Text style={{ fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 }}>
                        {maskPhone(p.phone)} · {p.peopleCount} ppl · {formatINR(p.amount)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Text
                        onPress={() => Linking.openURL(`tel:${p.phone}`)}
                        style={[styles.pill, { backgroundColor: palette.primary[50], color: palette.primary[700] }]}
                      >
                        Call
                      </Text>
                      <Text
                        onPress={() => Linking.openURL(`https://wa.me/${p.phone}`)}
                        style={[styles.pill, { backgroundColor: palette.primary[600], color: '#FFFFFF' }]}
                      >
                        Chat
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </>
      )}
    </Screen>
  );
}

function Stat({ label, value }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.borderMuted, padding: spacing[4] }}>
      <Text style={{ fontSize: typography.size.xs, color: colors.textMuted }}>{label}</Text>
      <Text style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text, marginTop: 4 }}>{value}</Text>
    </View>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], paddingVertical: spacing[2] }}>
      <Icon size={16} color={colors.textSubtle} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: typography.size.xs, color: colors.textMuted }}>{label}</Text>
        <Text style={{ fontSize: typography.size.sm, color: colors.text }}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontSize: typography.size.base, fontWeight: typography.weight.bold, color: colors.text, marginBottom: spacing[3] },
  metaText: { fontSize: typography.size.sm, color: colors.textMuted },
  participant: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[2], borderBottomWidth: 1, borderBottomColor: colors.borderMuted },
  pill: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.bold,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
