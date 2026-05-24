import { Text, View } from 'react-native';
import { radius, spacing, typography, palette } from '../../theme';

const TONES = {
  primary: { bg: palette.primary[50], text: palette.primary[700], border: palette.primary[200] },
  success: { bg: palette.primary[50], text: palette.primary[700], border: palette.primary[200] },
  danger:  { bg: palette.red[50],     text: palette.red[700],     border: palette.red[200] },
  warning: { bg: palette.amber[50],   text: palette.amber[700],   border: palette.amber[200] },
  info:    { bg: palette.blue[50],    text: palette.blue[700],    border: palette.blue[200] },
  neutral: { bg: palette.slate[100],  text: palette.slate[600],   border: palette.slate[200] },
  purple:  { bg: palette.purple[50],  text: palette.purple[700],  border: palette.purple[100] },
};

export default function Badge({ children, tone = 'neutral', size = 'sm', style }) {
  const c = TONES[tone] || TONES.neutral;
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: c.bg,
          borderColor: c.border,
          borderWidth: 1,
          paddingHorizontal: size === 'sm' ? spacing[2] : spacing[3],
          paddingVertical: size === 'sm' ? 2 : spacing[1],
          borderRadius: radius.full,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: c.text,
          fontSize: size === 'sm' ? typography.size['2xs'] : typography.size.xs,
          fontWeight: typography.weight.semibold,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
