import { Search, X } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search…', onClear, autoFocus = false }) {
  return (
    <View style={styles.wrap}>
      <Search size={16} color={colors.textSubtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        style={styles.input}
      />
      {value ? (
        <Pressable onPress={() => (onClear ? onClear() : onChangeText(''))}>
          <X size={16} color={colors.textSubtle} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
    height: 44,
    gap: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.text,
    paddingVertical: 0,
  },
});
