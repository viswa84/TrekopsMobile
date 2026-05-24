import { ActivityIndicator, Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, shadow } from '../../theme';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  const variantStyle = {
    primary:   { bg: colors.primary,        text: colors.textInverse, border: colors.primary },
    secondary: { bg: colors.bgElevated,     text: colors.text,        border: colors.border },
    danger:    { bg: colors.danger,         text: colors.textInverse, border: colors.danger },
    ghost:     { bg: 'transparent',         text: colors.text,        border: 'transparent' },
    soft:      { bg: colors.primarySoft,    text: colors.primaryText, border: colors.primaryBorder },
  }[variant];

  const sizeStyle = {
    sm: { py: spacing[2],   px: spacing[3], font: typography.size.sm },
    md: { py: spacing[3],   px: spacing[4], font: typography.size.base },
    lg: { py: spacing[3.5] || 14, px: spacing[5], font: typography.size.md },
  }[size];

  const handlePress = (e) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          paddingVertical: sizeStyle.py,
          paddingHorizontal: sizeStyle.px,
          opacity: isDisabled ? 0.6 : pressed ? 0.88 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          ...(variant === 'primary' ? shadow.sm : {}),
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" color={variantStyle.text} />
        ) : (
          <>
            {LeftIcon ? <LeftIcon size={16} color={variantStyle.text} /> : null}
            <Text
              style={[
                {
                  color: variantStyle.text,
                  fontSize: sizeStyle.font,
                  fontWeight: typography.weight.semibold,
                },
                textStyle,
              ]}
            >
              {children}
            </Text>
            {RightIcon ? <RightIcon size={16} color={variantStyle.text} /> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
});
