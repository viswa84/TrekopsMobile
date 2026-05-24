import { View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme';

export default function Card({ children, style, padded = true, ...rest }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.bgElevated,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.borderMuted,
          padding: padded ? spacing[4] : 0,
          ...shadow.xs,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
