import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

const Input = forwardRef(function Input(
  { label, error, hint, leftIcon: LeftIcon, rightIcon: RightIcon, style, inputStyle, containerStyle, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, { borderColor }, style]}>
        {LeftIcon ? (
          <View style={styles.iconLeft}>
            <LeftIcon size={16} color={colors.textSubtle} />
          </View>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textDisabled}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            { paddingLeft: LeftIcon ? 38 : 14, paddingRight: RightIcon ? 38 : 14 },
            inputStyle,
          ]}
        />
        {RightIcon ? (
          <View style={styles.iconRight}>
            <RightIcon size={16} color={colors.textSubtle} />
          </View>
        ) : null}
      </View>
      {error ? <Text style={styles.err}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
    marginBottom: spacing[1.5],
  },
  field: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 46,
    justifyContent: 'center',
  },
  input: {
    fontSize: typography.size.base,
    color: colors.text,
    paddingVertical: 12,
  },
  iconLeft: { position: 'absolute', left: 12, top: 0, bottom: 0, justifyContent: 'center' },
  iconRight: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' },
  err: { fontSize: typography.size.xs, color: colors.danger, marginTop: 4 },
  hint: { fontSize: typography.size.xs, color: colors.textSubtle, marginTop: 4 },
});

export default Input;
