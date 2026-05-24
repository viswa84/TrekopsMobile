import { StyleSheet, Text, View } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { colors, palette, radius, shadow, spacing, typography } from '../../theme';

export default function StatCard({ icon: Icon, label, value, change, tone = 'primary' }) {
  const tones = {
    primary: { bg: palette.primary[50],  fg: palette.primary[600] },
    blue:    { bg: palette.blue[50],     fg: palette.blue[600] },
    purple:  { bg: palette.purple[50],   fg: palette.purple[600] },
    orange:  { bg: palette.orange[50],   fg: palette.orange[600] },
    amber:   { bg: palette.amber[50],    fg: palette.amber[600] },
  };
  const t = tones[tone] || tones.primary;
  const positive = (change ?? 0) >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: t.bg }]}>
          {Icon ? <Icon size={18} color={t.fg} /> : null}
        </View>
        {change !== undefined && change !== null ? (
          <View style={[styles.change, { backgroundColor: positive ? palette.primary[50] : palette.red[50] }]}>
            {positive ? <TrendingUp size={12} color={palette.primary[700]} /> : <TrendingDown size={12} color={palette.red[700]} />}
            <Text style={{ fontSize: typography.size['2xs'], fontWeight: typography.weight.semibold, color: positive ? palette.primary[700] : palette.red[700] }}>
              {positive ? '+' : ''}{Number(change).toFixed(1)}%
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: spacing[4],
    minWidth: 140,
    ...shadow.xs,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  change: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: radius.full },
  value: { fontSize: typography.size['3xl'], fontWeight: typography.weight.bold, color: colors.text, marginTop: spacing[3] },
  label: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2 },
});
