import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../theme';

export default function PageHeader({ title, subtitle, back = false, right }) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {back ? (
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.7 : 1 }]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  back: {
    width: 38, height: 38,
    borderRadius: 19,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, color: colors.text },
  subtitle: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: 2 },
});
