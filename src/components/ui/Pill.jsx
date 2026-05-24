import { Pressable, Text } from 'react-native';
import { colors, palette, radius, spacing, typography } from '../../theme';

export default function Pill({ children, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: radius.full,
        backgroundColor: active ? colors.primary : colors.bgElevated,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          color: active ? colors.textInverse : colors.text,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
