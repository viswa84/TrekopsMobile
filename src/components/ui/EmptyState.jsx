import { Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing[12], paddingHorizontal: spacing[6] }}>
      {Icon ? (
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bgMuted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] }}>
          <Icon size={28} color={colors.textSubtle} />
        </View>
      ) : null}
      <Text style={{ fontSize: typography.size.lg, fontWeight: typography.weight.semibold, color: colors.text, marginBottom: spacing[1] }}>
        {title}
      </Text>
      {message ? (
        <Text style={{ fontSize: typography.size.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 }}>
          {message}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: spacing[4] }}>{action}</View> : null}
    </View>
  );
}
