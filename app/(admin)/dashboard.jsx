import { useQuery } from '@apollo/client/react';
import { ScrollView, StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import {
  AlertTriangle, Bell, BookOpen, CheckCircle2, IndianRupee, Info, Mountain, TrendingUp,
} from 'lucide-react-native';

import Screen from '../../src/components/ui/Screen';
import PageHeader from '../../src/components/ui/PageHeader';
import StatCard from '../../src/components/ui/StatCard';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import { useAuth } from '../../src/context/AuthContext';
import { GET_DASHBOARD } from '../../src/graphql/queries';
import { colors, palette, spacing, typography } from '../../src/theme';
import { formatINR, relativeTime } from '../../src/utils/format';

const screenW = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { user } = useAuth();
  const { data, loading, refetch } = useQuery(GET_DASHBOARD);
  const dash = data?.getDashboard;
  const kpis = dash?.kpis;

  return (
    <Screen scroll refreshing={loading && !data} onRefresh={() => refetch()}>
      <PageHeader
        title={`Hi, ${user?.name?.split(' ')[0] || user?.username || 'there'}`}
        subtitle="Here's how your business is doing today"
        right={
          <Pressable hitSlop={10} style={styles.bell}>
            <Bell size={20} color={colors.text} />
            <View style={styles.dot} />
          </Pressable>
        }
      />

      {/* KPI grid */}
      <View style={styles.kpiGrid}>
        {loading && !data ? (
          <>
            <SkeletonCard height={120} />
            <SkeletonCard height={120} />
          </>
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              label="Total Bookings"
              value={kpis?.totalBookings ?? 0}
              change={kpis?.bookingsChange}
              tone="primary"
            />
            <StatCard
              icon={IndianRupee}
              label="Revenue"
              value={formatINR(kpis?.revenue)}
              change={kpis?.revenueChange}
              tone="blue"
            />
          </>
        )}
      </View>
      <View style={styles.kpiGrid}>
        <StatCard
          icon={Mountain}
          label="Active Treks"
          value={kpis?.activeTreks ?? 0}
          change={kpis?.treksChange}
          tone="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversion"
          value={`${kpis?.conversionRate ?? 0}%`}
          change={kpis?.conversionChange}
          tone="orange"
        />
      </View>

      {/* Revenue chart */}
      <Card style={{ marginTop: spacing[5] }}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>Revenue by Month</Text>
          <Badge tone="primary">{kpis?.revenueChange >= 0 ? `+${kpis?.revenueChange?.toFixed?.(1) ?? 0}%` : `${kpis?.revenueChange?.toFixed?.(1) ?? 0}%`}</Badge>
        </View>
        {dash?.revenueByMonth?.length ? (
          <BarChart
            data={dash.revenueByMonth.map((m) => ({
              value: Number(m.revenue) / 1000,
              label: m.month?.slice(0, 3),
              frontColor: palette.primary[500],
              topLabelComponent: () => null,
            }))}
            barWidth={20}
            barBorderRadius={6}
            xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10 }}
            yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={colors.borderMuted}
            spacing={14}
            height={160}
            width={screenW - 80}
          />
        ) : (
          <EmptyState title="No revenue data yet" />
        )}
      </Card>

      {/* Region pie */}
      <Card style={{ marginTop: spacing[4] }}>
        <Text style={styles.cardTitle}>Bookings by Region</Text>
        {dash?.bookingsByRegion?.length ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[3] }}>
            <PieChart
              donut
              radius={70}
              innerRadius={48}
              innerCircleColor={colors.bgElevated}
              data={dash.bookingsByRegion.map((r) => ({
                value: Number(r.value) || 0,
                color: r.color || palette.primary[500],
              }))}
            />
            <View style={{ flex: 1, marginLeft: spacing[4], gap: spacing[2] }}>
              {dash.bookingsByRegion.map((r) => (
                <View key={r.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: r.color || palette.primary[500] }} />
                  <Text style={{ flex: 1, fontSize: typography.size.sm, color: colors.text }}>{r.name}</Text>
                  <Text style={{ fontSize: typography.size.sm, color: colors.textMuted, fontWeight: typography.weight.semibold }}>
                    {r.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <EmptyState title="No region data yet" />
        )}
      </Card>

      {/* Recent activity */}
      <Card style={{ marginTop: spacing[4] }}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        {dash?.recentActivity?.length ? (
          <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
            {dash.recentActivity.slice(0, 6).map((a) => (
              <View key={a.id} style={styles.activity}>
                <View style={[styles.activityIcon, { backgroundColor: palette.primary[50] }]}>
                  <CheckCircle2 size={16} color={palette.primary[600]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.size.sm, color: colors.text }} numberOfLines={2}>
                    {a.message}
                  </Text>
                  <Text style={{ fontSize: typography.size.xs, color: colors.textSubtle, marginTop: 2 }}>
                    {relativeTime(a.time)}
                  </Text>
                </View>
                {a.status ? <Badge tone="primary">{a.status}</Badge> : null}
              </View>
            ))}
          </View>
        ) : (
          <EmptyState title="No recent activity" />
        )}
      </Card>

      {/* Alerts */}
      {dash?.alerts?.length ? (
        <Card style={{ marginTop: spacing[4] }}>
          <Text style={styles.cardTitle}>Alerts & Reminders</Text>
          <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
            {dash.alerts.map((a) => {
              const isWarn = a.type === 'warning';
              const tone = isWarn ? palette.amber : palette.blue;
              return (
                <View key={a.id} style={[styles.alert, { borderLeftColor: tone[500] }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                    {isWarn ? <AlertTriangle size={14} color={tone[600]} /> : <Info size={14} color={tone[600]} />}
                    <Text style={{ flex: 1, fontWeight: typography.weight.semibold, color: colors.text, fontSize: typography.size.sm }}>
                      {a.title}
                    </Text>
                    <Badge tone={a.priority === 'high' ? 'danger' : a.priority === 'medium' ? 'warning' : 'info'}>
                      {a.priority}
                    </Badge>
                  </View>
                  <Text style={{ fontSize: typography.size.xs, color: colors.textMuted, marginTop: 4, marginLeft: 22 }}>
                    {a.message}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bell: { padding: 8, position: 'relative' },
  dot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: palette.red[500] },
  kpiGrid: { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[3] },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] },
  cardTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  activity: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] },
  activityIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  alert: { paddingLeft: spacing[3], paddingVertical: spacing[2], borderLeftWidth: 3, backgroundColor: colors.bgMuted, borderRadius: 6 },
});
