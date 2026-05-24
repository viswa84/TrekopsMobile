import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

export default function Screen({
  children,
  scroll = false,
  refreshing = false,
  onRefresh,
  padded = true,
  edges = ['top', 'left', 'right'],
  background = colors.bg,
  contentContainerStyle,
  style,
}) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[
        { padding: padded ? spacing[4] : 0, paddingBottom: spacing[20] },
        contentContainerStyle,
      ]}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, padding: padded ? spacing[4] : 0 }, style]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: background }}>
      <StatusBar style="dark" />
      {inner}
    </SafeAreaView>
  );
}
