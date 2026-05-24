import { Pressable, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export default function SectionHeader({ title, action, onAction }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] }}>
      <Text style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text }}>
        {title}
      </Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={{ fontSize: typography.size.sm, color: colors.primaryText, fontWeight: typography.weight.semibold }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
