import { Image, Text, View } from 'react-native';
import { palette, radius, typography } from '../../theme';
import { initials } from '../../utils/format';

export default function Avatar({ name, uri, size = 40, tone = 'primary' }) {
  const tones = {
    primary: { bg: palette.primary[100], fg: palette.primary[700] },
    blue:    { bg: palette.blue[100],    fg: palette.blue[700] },
    purple:  { bg: palette.purple[100],  fg: palette.purple[700] },
    amber:   { bg: palette.amber[100],   fg: palette.amber[700] },
    slate:   { bg: palette.slate[200],   fg: palette.slate[700] },
  };
  const t = tones[tone] || tones.primary;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius.full, backgroundColor: t.bg }}
      />
    );
  }
  return (
    <View
      style={{
        width: size, height: size, borderRadius: radius.full,
        backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Text style={{ color: t.fg, fontWeight: typography.weight.bold, fontSize: size * 0.4 }}>
        {initials(name)}
      </Text>
    </View>
  );
}
